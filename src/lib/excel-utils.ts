import type { CustomerLoanItem } from '@/services'
import * as XLSX from 'xlsx'

// Excel column headers (26 columns)
const EXCEL_HEADERS = [
  'Регистр',
  'Овог',
  'Нэр',
  'Харилцагчийн ID',
  'Утас1',
  'Зээл хэтэрсэн хоног',
  'Гэрийн хаяг',
  'Байршил (уртраг өргөрөг)',
  'Ажлын газар',
  'Тэмдэглэл',
  'Олгосон зээл',
  'Төлөх хүү',
  'Төлөх нэмэгдүүлсэн хүү',
  'Зээл хаах дүн',
  'Зээлийн төрөл',
  'Зээлийн ID',
  'Зээлийн огноо',
  'Төлөв',
  'Одоо төлбөл зохих дүн',
  'Дүүрэг',
  'Хороо',
  'Ажил',
  'Ажлын хаяг (уртраг өргөрөг)',
  'Одоо амьдарч байгаа хаяг (уртраг өргөрөг)',
  'Нэмэлт хаяг (уртраг өргөрөг)',
  'Эдийн засагчийн ID',
  'Сарын хүү',
]

// Map Excel data to CustomerLoanItem
export function parseExcelToCustomerLoans(
  file: File
): Promise<CustomerLoanItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // Skip header row
        const rows = jsonData.slice(1) as any[][]

        const customerLoans: CustomerLoanItem[] = rows
          .filter((row) => row && row.length > 0)
          .map((row) => ({
            registerNumber: String(row[0] || ''),
            lastName: String(row[1] || ''),
            firstName: String(row[2] || ''),
            customerId: String(row[3] || ''),
            phoneNumber: String(row[4] || ''),
            overdueDay: Number(row[5]) || 0,
            address: String(row[6] || ''),
            location: String(row[7] || ''),
            jobName: String(row[8] || ''),
            description: String(row[9] || ''),
            loanAmount: Number(row[10]) || 0,
            payInterest: Number(row[11]) || 0,
            payExtraInterest: Number(row[12]) || 0,
            closePayAmount: Number(row[13]) || 0,
            loanType: String(row[14] || ''),
            loanId: String(row[15] || ''),
            loanDate: Number(row[16]) || 0,
            status: String(row[17] || 'Хэвийн'),
            payAmount: Number(row[18]) || 0,
            district: String(row[19] || ''),
            khoroo: String(row[20] || ''),
            job: String(row[21] || ''),
            workLocation: String(row[22] || ''),
            currentLocation: String(row[23] || ''),
            additionalLocation: String(row[24] || ''),
            economist: String(row[25] || 'Зээлийн мэргэжилтэн 1'),
            interestRate: row[26] ? Number(row[26]) : undefined,
          }))

        resolve(customerLoans)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsBinaryString(file)
  })
}

// Generate Excel template
export function generateExcelTemplate() {
  const wb = XLSX.utils.book_new()

  // Sample data with one example row
  const sampleData = [
    [
      'ТА12345678', // Регистр
      'Баяр', // Овог
      'Сүх', // Нэр
      'CUST001', // Харилцагчийн ID
      '99887766', // Утас1
      0, // Зээл хэтэрсэн хоног
      'БЗД 1-р хороо', // Гэрийн хаяг
      '47.93106291964105 106.9649805649562', // Байршил (уртраг өргөрөг)
      'Програм хангамж хөгжүүлэгч', // Ажлын газар (jobName)
      'Гэр ахуйн зээл', // Тэмдэглэл
      5000000, // Олгосон зээл
      50000, // Төлөх хүү
      10000, // Төлөх нэмэгдүүлсэн хүү
      4500000, // Зээл хаах дүн
      'Хэрэглээний зээл', // Зээлийн төрөл
      'LOAN20240001', // Зээлийн ID
      20240101, // Зээлийн огноо
      'Хэвийн', // Төлөв
      500000, // Одоо төлбөл зохих дүн
      'Баянзүрх', // Дүүрэг
      '1-р хороо', // Хороо
      'Ажилтан', // Ажил
      '47.91234567890123 106.9123456789012', // Ажлын хаяг (уртраг өргөрөг)
      '47.92345678901234 106.9234567890123', // Одоо амьдарч байгаа хаяг (уртраг өргөрөг)
      '47.94567890123456 106.9456789012345', // Нэмэлт хаяг (уртраг өргөрөг)
      'Зээлийн мэргэжилтэн 1', // Эдийн засагчийн ID
      2, // Сарын хүү
    ],
  ]

  const ws = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS, ...sampleData])

  // Set column widths
  ws['!cols'] = Array(EXCEL_HEADERS.length).fill({ wch: 20 })

  XLSX.utils.book_append_sheet(wb, ws, 'Зээлийн өгөгдөл')

  // Generate and download file
  XLSX.writeFile(wb, 'loan-import-template.xlsx')
}

// Download imported data as Excel
export function exportToExcel(data: CustomerLoanItem[], filename: string) {
  const wb = XLSX.utils.book_new()

  const exportData = data.map((item) => [
    item.registerNumber,
    item.lastName,
    item.firstName,
    item.customerId,
    item.phoneNumber,
    item.overdueDay,
    item.address,
    item.location,
    item.jobName,
    item.description,
    item.loanAmount,
    item.payInterest,
    item.payExtraInterest,
    item.closePayAmount,
    item.loanType,
    item.loanId,
    item.loanDate,
    item.status,
    item.payAmount,
    item.district,
    item.khoroo,
    item.job,
    item.workLocation,
    item.currentLocation,
    item.additionalLocation,
    item.economist,
    item.interestRate,
  ])

  const ws = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS, ...exportData])
  ws['!cols'] = Array(EXCEL_HEADERS.length).fill({ wch: 20 })

  XLSX.utils.book_append_sheet(wb, ws, 'Зээлийн өгөгдөл')
  XLSX.writeFile(wb, filename)
}
