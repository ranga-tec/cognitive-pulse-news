const express = require('express')
const uploadHandler = require('./upload-handler')

const app = express()
const PORT = process.env.PORT || 3001

app.use(uploadHandler)

app.listen(PORT, () => {
  console.log(`Upload server running on port ${PORT}`)
})
