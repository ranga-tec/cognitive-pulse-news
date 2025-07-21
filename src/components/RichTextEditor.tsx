import React, { useMemo, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null)

  // Custom toolbar with HTML embedding options
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['code-block', 'blockquote'],
        ['clean'],
        ['html'] // Custom HTML button
      ],
      handlers: {
        'html': function() {
          const quill = quillRef.current?.getEditor()
          if (!quill) return

          // Prompt for HTML content
          const htmlContent = prompt('Enter your HTML/Embed code:')
          if (htmlContent) {
            const range = quill.getSelection()
            if (range) {
              // Insert HTML directly
              quill.clipboard.dangerouslyPasteHTML(range.index, htmlContent)
            }
          }
        }
      }
    },
    clipboard: {
      matchVisual: false,
      // Allow HTML pasting
      matchers: [
        ['img', function(node: any, delta: any) {
          // Preserve image attributes
          const ops = delta.ops || []
          ops.forEach((op: any) => {
            if (op.insert && op.insert.image) {
              op.attributes = {
                ...op.attributes,
                width: node.getAttribute('width'),
                height: node.getAttribute('height'),
                alt: node.getAttribute('alt')
              }
            }
          })
          return delta
        }],
        ['iframe', function(node: any, delta: any) {
          // Handle iframe embeds (YouTube, etc.)
          const src = node.getAttribute('src')
          if (src) {
            return new (window as any).Quill.import('delta')().insert({
              video: src
            })
          }
          return delta
        }]
      ]
    }
  }), [])

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align',
    'code-block'
  ]

  return (
    <div className="bg-white">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: '300px', marginBottom: '50px' }}
      />
      
      {/* HTML Embed Helper */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 HTML Embed Support:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>YouTube:</strong> Paste YouTube URLs directly or use iframe embed code</li>
          <li>• <strong>Twitter:</strong> Use Twitter embed code from tweet</li>
          <li>• <strong>CodePen:</strong> Copy embed code from CodePen</li>
          <li>• <strong>Custom HTML:</strong> Click HTML button in toolbar for custom embeds</li>
          <li>• <strong>Images:</strong> Drag & drop or paste image URLs</li>
        </ul>
      </div>
    </div>
  )
}