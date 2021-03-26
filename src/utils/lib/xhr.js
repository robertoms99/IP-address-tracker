const originalSendMethod = window.XMLHttpRequest.prototype.send
window.XMLHttpRequest.prototype.send = function (body) {
  const currentXHR = this
  originalSendMethod.call(currentXHR, body)
  return new Promise((resolve, reject) => {
    currentXHR.addEventListener('load', () => {
      resolve(currentXHR.response)
    })
    currentXHR.addEventListener('error', () => {
      reject(new Error('Request Error'))
    })
  })
}
