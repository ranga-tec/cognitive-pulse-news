// For your Kamatera server - Node.js/Express upload handler
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs').promises
const { v4: uuidv4 } = require('uuid')

const router = express.Router()

// Configure multer for file upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  },
})

// Upload endpoint
router.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }

    // Generate unique filename
    const fileExtension = path.extname(req.file.originalname) || '.jpg'
    const fileName = `${uuidv4()}${fileExtension}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../public/uploads/blog-images')
    await fs.mkdir(uploadDir, { recursive: true })
    
    const filePath = path.join(uploadDir, fileName)

    // Process image with Sharp (resize, optimize)
    let processedImage = sharp(req.file.buffer)

    // Resize to optimal dimensions (1200x630 for social sharing)
    if (req.body.resize === 'true') {
      processedImage = processedImage
        .resize(1200, 630, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85, progressive: true })
    }

    // Save the processed image
    await processedImage.toFile(filePath)

    // Generate public URL
    const publicUrl = `/uploads/blog-images/${fileName}`
    const fullUrl = `https://blog.nuraledge.com${publicUrl}`

    // Log successful upload
    console.log(`Image uploaded: ${fileName} (${req.file.size} bytes)`)

    res.json({
      success: true,
      url: fullUrl,
      filename: fileName,
      size: req.file.size,
      originalName: req.file.originalname
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    })
  }
})

// Serve uploaded images
router.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

module.exports = router