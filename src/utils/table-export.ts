import type { Table } from '@tanstack/react-table'

/**
 * Export table data to CSV format
 */
export function exportTableToCSV<TData extends Record<string, unknown>>(
  table: Table<TData>,
  fileName: string = 'export.csv'
): void {
  const visibleColumns = table
    .getVisibleLeafColumns()
    .filter((col) => col.id !== 'actions' && col.id !== 'select')

  // Get headers
  const headers = visibleColumns.map((col) => {
    const header = col.columnDef.header
    if (typeof header === 'string') {
      return header
    }
    if (typeof header === 'function') {
      const headerResult = header({
        column: col,
        header: col.columnDef.header,
        table,
      } as any)
      if (typeof headerResult === 'string') {
        return headerResult
      }
    }
    return col.id
  })

  // Get rows
  const rows = table.getRowModel().rows.map((row) => {
    return visibleColumns.map((col) => {
      const cellValue = row.getValue(col.id)
      if (cellValue === null || cellValue === undefined) {
        return ''
      }
      // Handle React nodes and objects
      if (typeof cellValue === 'object') {
        // Try to extract text content from React nodes
        if ('props' in cellValue && typeof cellValue === 'object') {
          return ''
        }
        return JSON.stringify(cellValue)
      }
      // Convert to string and escape quotes
      const stringValue = String(cellValue)
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      if (
        stringValue.includes(',') ||
        stringValue.includes('\n') ||
        stringValue.includes('"')
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
  })

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    fileName.endsWith('.csv') ? fileName : `${fileName}.csv`
  )
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export table data to Excel format (XLSX)
 * Requires xlsx library to be installed: npm install xlsx
 * Falls back to CSV if xlsx is not available
 */
export async function exportTableToExcel<TData extends Record<string, unknown>>(
  table: Table<TData>,
  fileName: string = 'export.xlsx'
): Promise<void> {
  try {
    console.log('Starting Excel export...', {
      fileName,
      rowCount: table.getRowModel().rows.length,
    })
    // Dynamic import to avoid bundle size if not used
    // Note: Install xlsx package first: npm install xlsx
    let XLSX: any
    try {
      XLSX = await import('xlsx')
      console.log('xlsx library loaded successfully')
    } catch (importError) {
      // xlsx is not installed, fallback to CSV
      console.warn(
        'xlsx library not found. Falling back to CSV export.',
        importError
      )
      return exportTableToCSV(table, fileName.replace('.xlsx', '.csv'))
    }

    const visibleColumns = table
      .getVisibleLeafColumns()
      .filter((col) => col.id !== 'actions' && col.id !== 'select')

    // Get headers
    const headers = visibleColumns.map((col) => {
      const header = col.columnDef.header
      if (typeof header === 'string') {
        return header
      }
      if (typeof header === 'function') {
        const headerResult = header({
          column: col,
          header: col.columnDef.header,
          table,
        } as any)
        if (typeof headerResult === 'string') {
          return headerResult
        }
      }
      return col.id
    })

    // Get rows
    const rows = table.getRowModel().rows.map((row) => {
      const rowData: Record<string, unknown> = {}
      visibleColumns.forEach((col, index) => {
        const cellValue = row.getValue(col.id)
        // Extract text from React nodes if possible
        if (cellValue === null || cellValue === undefined) {
          rowData[headers[index]] = ''
        } else if (typeof cellValue === 'object' && 'props' in cellValue) {
          // React node - try to extract text
          rowData[headers[index]] = ''
        } else {
          rowData[headers[index]] = cellValue
        }
      })
      return rowData
    })

    console.log('Creating Excel workbook...', {
      headers,
      rowCount: rows.length,
    })
    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Generate file and download
    console.log('Generating Excel buffer...')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    console.log('Excel buffer generated', { size: excelBuffer.length })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    console.log('Blob created', { size: blob.size, type: blob.type })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    const downloadFileName = fileName.endsWith('.xlsx')
      ? fileName
      : `${fileName}.xlsx`
    link.download = downloadFileName
    link.style.display = 'none'
    document.body.appendChild(link)
    console.log('Triggering download...', {
      downloadFileName,
      url,
      blobSize: blob.size,
    })

    // Trigger download
    link.click()

    // Cleanup after a short delay
    setTimeout(() => {
      if (link.parentNode) {
        document.body.removeChild(link)
      }
      URL.revokeObjectURL(url)
      console.log('Download cleanup completed')
    }, 200)
  } catch (error) {
    console.error('Failed to export to Excel. Falling back to CSV.', error)
    // Fallback to CSV if xlsx is not available
    exportTableToCSV(table, fileName.replace('.xlsx', '.csv'))
  }
}

/**
 * Export table data - automatically chooses format based on file extension
 */
export function exportTable<TData extends Record<string, unknown>>(
  table: Table<TData>,
  fileName: string = 'export.csv',
  format: 'csv' | 'excel' = 'csv'
): void | Promise<void> {
  if (format === 'excel' || fileName.endsWith('.xlsx')) {
    return exportTableToExcel(table, fileName)
  }
  exportTableToCSV(table, fileName)
}
