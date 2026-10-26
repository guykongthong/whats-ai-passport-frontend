import apiClient from './apiClient'

export interface UploadResponse {
  url: string
}

export const FileService = {
  /**
   * Upload an image file to cloud storage via backend.
   * Public endpoint (no token required).
   * Request: multipart/form-data with 'file' field.
   * Response: { url: string }
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<UploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export default FileService
