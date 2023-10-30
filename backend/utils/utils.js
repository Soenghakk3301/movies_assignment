import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Function to save the uploaded image to the server
export const saveImage = (imageFile) => {
  const uploadDir = path.join(__dirname, '../public/images')
  const imageName = `${Date.now()}_${imageFile.originalname}`
  const imagePath = path.join(uploadDir, imageName)

  fs.mkdirSync(uploadDir, { recursive: true })
  fs.writeFileSync(imagePath, imageFile.buffer)

  return imageName
}

// Function to delete an image
export const deleteImage = (imageName) => {
  const imagePath = path.join(__dirname, '../public/images', imageName)

  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    // Delete the image file
    fs.unlinkSync(imagePath)
  } else {
    console.error('Image not found:', imageName)
  }
}
