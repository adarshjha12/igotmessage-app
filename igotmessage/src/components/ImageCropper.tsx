// components/ImageCropper.tsx
import React, { useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

export default function ImageCropper() {
  const editorRef = useRef<AvatarEditor | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [scale, setScale] = useState(1.2)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas()
      const croppedImage = canvas.toDataURL()
      console.log('Cropped image:', croppedImage)
      // You can upload or use it here
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {image && (
        <AvatarEditor
          ref={editorRef}
          image={image}
          width={250}
          height={250}
          border={30}
          borderRadius={25}
          color={[255, 255, 255, 0.6]} // optional background
          scale={scale}
          rotate={0}
        />
      )}

      <input
        type="range"
        min="1"
        max="3"
        step="0.1"
        value={scale}
        onChange={(e) => setScale(parseFloat(e.target.value))}
        className="w-48"
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Save Cropped Image
      </button>
    </div>
  )
}
