export const openSignupModal = (actionSuccess?: () => void) => {
  const event = new CustomEvent('openSignupModal', { detail: { actionSuccess } })
  document.dispatchEvent(event)
}
