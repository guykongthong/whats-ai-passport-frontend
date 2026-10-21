import { ref } from 'vue'

export function useToast() {
  const showToast = ref(false)
  const toastMessage = ref('')

  function triggerToast(message: string, duration = 1000): Promise<void> {
    toastMessage.value = message
    showToast.value = true
    return new Promise((resolve) => {
      setTimeout(() => {
        showToast.value = false
        resolve()
      }, duration)
    })
  }

  return {
    showToast,
    toastMessage,
    triggerToast,
  }
}
