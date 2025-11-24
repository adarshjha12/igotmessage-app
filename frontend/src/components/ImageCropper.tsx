import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

interface Props {
  image: any;
  setImage: (val: any) => void;
  closeEditor?: () => void;
  startConverting?: (val: boolean) => void;
}

export default function ImageCropper({
  image,
  setImage,
  closeEditor,
  startConverting,
}: Props) {
  const editorRef = useRef<AvatarEditor | null>(null);
  const [scale, setScale] = useState(0.8);

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const croppedImage = canvas.toDataURL();
      console.log("Cropped image:", croppedImage);
      setImage(croppedImage);
      startConverting && startConverting(true);
      closeEditor && closeEditor();
    }
  };

  return (
    <div className="flex justify-center items-center bg-[var(--bgColor)]">
      <div className="bg-[var(--bgColor)] shadow-xl rounded-2xl p-6 max-w-md w-full flex flex-col items-center gap-6  ">
        <h2 className="text-2xl font-semibold text-[var(--textColor)] tracking-tight">
          Crop Your Image
        </h2>

        {/* Cropper */}
        {image && (
          <>
            <AvatarEditor
             key={typeof image === "string" ? image : image.name}
              ref={editorRef}
              image={image}
              width={250}
              height={250}
              border={20}
              borderRadius={125}
              color={[255, 255, 255, 0.4]}
              scale={scale}
              rotate={0}
              className="rounded-xl bg-[var(--textColor)] shadow-md"
            />

            {/* Zoom Slider */}
            <div className="w-full flex flex-col items-center gap-2">
              <label className="text-[var(--textColor)] text-sm">Zoom</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-3/4 accent-blue-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setImage(null);
                  closeEditor && closeEditor();
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
