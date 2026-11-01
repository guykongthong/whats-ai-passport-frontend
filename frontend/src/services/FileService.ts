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
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post<UploadResponse>('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.data?.url) {
        return response.data
      }
    } catch (err: unknown) {
      console.warn('Backend cloud storage upload unavailable, falling back to local data URL:', err)
    }

    // High fidelity data URL fallback for preview and local storage
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('custom_admin_avatar', dataUrl)
      } catch {
        // ignore
      }
    }

    return { url: dataUrl }
  },
}

export default FileService
