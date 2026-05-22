export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === "string") {
        return resolve(reader.result)
      }
      reject("base64 string error")
    }
    reader.onerror = (error) => reject(error)
  })
}
