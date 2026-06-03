export function downloadPdf(fileName: string, base64: string) {
  const source = `data:application/pdf;base64,${base64}`
  const link = document.createElement("a")
  link.href = source
  link.download = fileName + ".pdf"
  link.click()
}

function collectDocumentStyles(): string {
  return [...document.styleSheets]
    .flatMap((styleSheet) => {
      try {
        return [...styleSheet.cssRules].map((rule) => rule.cssText)
      } catch {
        return []
      }
    })
    .join("\n")
}

export function buildPdfHtml(element: HTMLElement): string {
  return `
    <style>
      ${collectDocumentStyles()}

      body {
        overflow: unset;
        background-color: white;
      }
    </style>
    ${element.outerHTML}
  `
}
