import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { buildPdfHtml, downloadPdf } from "./pdf-export"

describe("pdf-export utils", () => {
  describe("downloadPdf", () => {
    it("should create an anchor element, set href to data URI, set download attribute with .pdf extension, and click it", () => {
      const base64Data = "SGVsbG8gV29ybGQ="
      const fileName = "test-resume"

      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      } as unknown as HTMLAnchorElement

      const createElementSpy = vi
        .spyOn(document, "createElement")
        .mockImplementation((tagName) => {
          if (tagName === "a") {
            return mockAnchor
          }
          return document.createElement(tagName)
        })

      downloadPdf(fileName, base64Data)

      expect(createElementSpy).toHaveBeenCalledWith("a")
      expect(mockAnchor.href).toBe(
        "data:application/pdf;base64,SGVsbG8gV29ybGQ="
      )
      expect(mockAnchor.download).toBe("test-resume.pdf")
      expect(mockAnchor.click).toHaveBeenCalledTimes(1)

      createElementSpy.mockRestore()
    })
  })

  describe("buildPdfHtml", () => {
    let originalStyleSheets: PropertyDescriptor | undefined

    beforeEach(() => {
      originalStyleSheets = Object.getOwnPropertyDescriptor(
        Document.prototype,
        "styleSheets"
      )
    })

    afterEach(() => {
      if (originalStyleSheets) {
        Object.defineProperty(
          Document.prototype,
          "styleSheets",
          originalStyleSheets
        )
      } else {
        // @ts-expect-error - clean up if it wasn't there
        delete Document.prototype.styleSheets
      }
    })

    it("should compile styles from document.styleSheets and wrap element outerHTML", () => {
      const mockRule1 = { cssText: ".style1 { color: red; }" } as CSSRule
      const mockRule2 = { cssText: ".style2 { color: blue; }" } as CSSRule

      const mockStyleSheets = [
        {
          cssRules: [mockRule1] as unknown as CSSRuleList,
        },
        {
          cssRules: [mockRule2] as unknown as CSSRuleList,
        },
        {
          get cssRules(): CSSRuleList {
            throw new Error("SecurityError")
          },
        },
      ]

      Object.defineProperty(Document.prototype, "styleSheets", {
        get: () => mockStyleSheets as unknown as StyleSheetList,
        configurable: true,
      })

      const testElement = document.createElement("div")
      testElement.id = "pdf-root"
      testElement.innerHTML = "<h1>Hello</h1>"

      const result = buildPdfHtml(testElement)

      expect(result).toContain(".style1 { color: red; }")
      expect(result).toContain(".style2 { color: blue; }")
      expect(result).toContain("body {")
      expect(result).toContain("overflow: unset;")
      expect(result).toContain("background-color: white;")
      expect(result).toContain('<div id="pdf-root"><h1>Hello</h1></div>')
    })
  })
})
