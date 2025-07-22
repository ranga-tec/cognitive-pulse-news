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

  // Enhanced toolbar with text alignment options
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
        [{ 'direction': 'rtl' }],
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
    'align', 'direction',
    'code-block'
  ]

  return (
    <div className="bg-white">
      <style jsx>{`
        .ql-editor {
          min-height: 500px !important;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .ql-container {
          font-size: 16px;
        }
        
        /* Fix tab indentation alignment issues */
        .ql-editor .ql-indent-1 {
          padding-left: 3em !important;
          text-align: left !important;
        }
        
        .ql-editor .ql-indent-2 {
          padding-left: 6em !important;
          text-align: left !important;
        }
        
        .ql-editor .ql-indent-3 {
          padding-left: 9em !important;
          text-align: left !important;
        }
        
        .ql-editor .ql-indent-4 {
          padding-left: 12em !important;
          text-align: left !important;
        }
        
        .ql-editor .ql-indent-5 {
          padding-left: 15em !important;
          text-align: left !important;
        }
        
        .ql-editor .ql-indent-6 {
          padding-left: 18em !important;
          text-align: left !important;
        }
        
        .ql-editor .ql-indent-7 {
          padding-left: 21em !important;
          text-align: left !important;
        }
        
        .ql-editor .ql-indent-8 {
          padding-left: 24em !important;
          text-align: left !important;
        }
        
        /* Enhanced toolbar styling */
        .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          background: #f8f9fa;
        }
        
        /* Alignment button styling */
        .ql-align .ql-picker-label[data-value=""] svg,
        .ql-align .ql-picker-item[data-value=""] svg {
          /* Left align icon */
        }
        
        .ql-align .ql-picker-label[data-value="center"] svg,
        .ql-align .ql-picker-item[data-value="center"] svg {
          /* Center align icon */
        }
        
        .ql-align .ql-picker-label[data-value="right"] svg,
        .ql-align .ql-picker-item[data-value="right"] svg {
          /* Right align icon */
        }
        
        .ql-align .ql-picker-label[data-value="justify"] svg,
        .ql-align .ql-picker-item[data-value="justify"] svg {
          /* Justify align icon */
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ 
          minHeight: '600px',
          marginBottom: '60px'
        }}
      />
      
      {/* Enhanced HTML Embed Helper */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-3">💡 Enhanced Editor Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-semibold mb-2">📝 Text Formatting:</h5>
            <ul className="space-y-1">
              <li>• <strong>Alignment:</strong> Left, Center, Right, Justify</li>
              <li>• <strong>Indentation:</strong> Proper tab spacing (left-aligned)</li>
              <li>• <strong>Headers:</strong> H1 through H6 styles</li>
              <li>• <strong>Lists:</strong> Ordered and unordered lists</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-2">🎯 Media Embeds:</h5>
            <ul className="space-y-1">
              <li>• <strong>YouTube:</strong> Paste URLs or iframe code</li>
              <li>• <strong>Images:</strong> Drag & drop or paste URLs</li>
              <li>• <strong>Code Blocks:</strong> Syntax highlighting</li>
              <li>• <strong>Custom HTML:</strong> Click HTML button for embeds</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-700">
          <strong>💡 Pro Tip:</strong> Use the alignment buttons in the toolbar for proper text alignment. 
          Indented text will stay left-aligned for better readability.
        </div>
      </div>
    </div>
  )
}