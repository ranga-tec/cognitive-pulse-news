import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Upload, X, ImageIcon, Check, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Featured Image" }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP, etc.)')
      return false
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return false
    }

    // Check image dimensions (optional)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Supported formats: JPEG, PNG, WebP, GIF')
      return false
    }

    return true
  }

  const handleFile = async (file: File) => {
    setError('')
    
    if (!validateFile(file)) {
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', file)
      
      // Add metadata
      formData.append('folder', 'blog-images')
      formData.append('resize', 'true') // Server should resize to optimal dimensions
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload to your server
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.url) {
        onChange(result.url)
        setUploadProgress(0)
      } else {
        throw new Error(result.error || 'Upload failed')
      }

    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.message || 'Upload failed. Please try again.')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    onChange('')
    setError('')
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Current Image Display (Read-only URL) */}
      {value && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Current Image URL (Read-only)</Label>
          <div className="flex items-center space-x-2">
            <Input
              value={value}
              readOnly
              className="bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="Image will appear here after upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="space-y-4">
            {uploading ? (
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">Uploading image...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    Choose Image File
                  </Button>
                  <p className="text-sm text-gray-500">
                    or drag and drop an image here
                  </p>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Supported: JPEG, PNG, WebP, GIF</p>
                  <p>Max size: 5MB • Recommended: 1200x630px</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview */}
      {value && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Preview</Label>
          <div className="border rounded-lg overflow-hidden bg-gray-50 aspect-video relative">
            <img 
              src={value} 
              alt="Uploaded preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling!.style.display = 'flex'
              }}
            />
            <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-gray-500 absolute inset-0">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Failed to load image</p>
              </div>
            </div>
            
            {/* Success indicator */}
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <Check className="h-3 w-3" />
            </div>
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 text-sm">📁 Server Upload Benefits:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Images stored securely on your server</li>
          <li>• Automatic optimization and resizing</li>
          <li>• Fast loading with proper compression</li>
          <li>• No external dependencies or broken links</li>
          <li>• SEO-friendly image URLs</li>
        </ul>
      </div>
    </div>
  )
}