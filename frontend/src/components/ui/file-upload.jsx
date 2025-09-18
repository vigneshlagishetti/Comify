import * as React from "react"
import { Upload, Image as ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const FileUpload = React.forwardRef(
  ({ className, onFileSelect, accept = "image/*", multiple = false, children, ...props }, ref) => {
    const [dragOver, setDragOver] = React.useState(false)
    const [selectedFiles, setSelectedFiles] = React.useState([])
    const fileInputRef = React.useRef(null)

    const handleDragOver = (e) => {
      e.preventDefault()
      setDragOver(true)
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      setDragOver(false)
    }

    const handleDrop = (e) => {
      e.preventDefault()
      setDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFiles(files)
      }
    }

    const handleFileInput = (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        handleFiles(files)
      }
    }

    const handleFiles = (files) => {
      const validFiles = files.filter(file => {
        if (accept.includes('image/*')) {
          return file.type.startsWith('image/')
        }
        return accept.split(',').some(type => file.type.includes(type.trim()))
      })

      if (multiple) {
        setSelectedFiles(prev => [...prev, ...validFiles])
        onFileSelect?.(validFiles)
      } else {
        setSelectedFiles(validFiles.slice(0, 1))
        onFileSelect?.(validFiles[0])
      }
    }

    const removeFile = (index) => {
      setSelectedFiles(prev => {
        const newFiles = prev.filter((_, i) => i !== index)
        if (multiple) {
          onFileSelect?.(newFiles)
        } else {
          onFileSelect?.(null)
        }
        return newFiles
      })
    }

    const openFileDialog = () => {
      fileInputRef.current?.click()
    }

    return (
      <div className={cn("w-full", className)} {...props}>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30",
            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
          />
          
          {children || (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <Upload className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-gray-500">
                {accept.includes('image') ? 'PNG, JPG, GIF up to 10MB' : 'Select files to upload'}
              </p>
            </div>
          )}
        </div>

        {/* Preview selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

const ImageUpload = React.forwardRef(
  ({ className, onImageSelect, preview = true, ...props }, ref) => {
    const [previewUrl, setPreviewUrl] = React.useState(null)

    const handleFileSelect = (file) => {
      if (file && preview) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
      onImageSelect?.(file)
    }

    React.useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    }, [previewUrl])

    return (
      <div className={cn("w-full", className)}>
        <FileUpload
          ref={ref}
          accept="image/*"
          onFileSelect={handleFileSelect}
          className="mb-4"
          {...props}
        >
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <p className="text-white text-sm font-medium">Click to change image</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto h-16 w-16 mb-4 flex items-center justify-center rounded-full bg-blue-100">
                <ImageIcon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Upload company logo
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or GIF (max. 2MB)
              </p>
            </div>
          )}
        </FileUpload>
      </div>
    )
  }
)
ImageUpload.displayName = "ImageUpload"

export { FileUpload, ImageUpload }