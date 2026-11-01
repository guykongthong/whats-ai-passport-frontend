import { ref } from 'vue'

const showToast = ref(false)
const toastMessage = ref('')

export function useToast() {
  function triggerToast(message: string, duration = 3000): Promise<void> {
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
