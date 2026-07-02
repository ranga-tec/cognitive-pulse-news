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

    const uploadDir = path.join(__dirname, '../public/uploads/blog-images')
    await fs.mkdir(uploadDir, { recursive: true })

    const baseName = uuidv4()
    const targetExt = '.webp'
    const fileName = `${baseName}${targetExt}`
    const filePath = path.join(uploadDir, fileName)

    const baseImage = sharp(req.file.buffer, { failOn: 'none' }).rotate()
    const metadata = await baseImage.metadata()
    const maxDimension = 1600

    const processedImage = baseImage
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 5,
        smartSubsample: true,
        lossless: metadata.hasAlpha || false,
      })

    await processedImage.toFile(filePath)

    const publicUrl = `/uploads/blog-images/${fileName}`
    const fullUrl = `https://blog.neuralsedge.com${publicUrl}`

    console.log(`Image uploaded: ${fileName} (${req.file.size} bytes -> webp)` )

    res.json({
      success: true,
      url: fullUrl,
      filename: fileName,
      size: req.file.size,
      originalName: req.file.originalname,
      format: 'webp',
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
