import React, { useState } from 'react'

export default function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder.jpg')

  return (
    <div className="flex flex-col">
      <img
        src={selectedImage}
        alt="Product"
        className="w-full h-96 object-cover rounded-lg mb-4"
      />
      <div className="flex space-x-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
              selectedImage === image ? 'border-blue-500' : 'border-gray-300'
            }`}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
    </div>
  )
}
