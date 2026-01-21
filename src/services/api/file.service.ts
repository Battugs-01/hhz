import { apiClient } from './client'

export interface UploadFileResponse {
  id: number
  fileName: string
  originalName: string
  physicalPath: string
  extension: string
  fileSize: number
  createdBy: number
  createdAt: string
  updatedAt: string
}

export interface UploadFileResult {
  success: boolean
  message: string
  data: UploadFileResponse
  code: number
}

export const fileService = {
  uploadFile: async (file: File): Promise<UploadFileResult> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<UploadFileResult>('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },
}
