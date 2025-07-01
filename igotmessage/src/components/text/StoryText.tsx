import React, { useState } from 'react'

function StoryText() {
    const [fontSize, setFontSize] = useState(14);
    const [weight, setWeight] = useState<'normal' | 'bold'>('normal');
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [color, setColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('green');
    const [bgOpacity, setBgOpacity] = useState(1);

  return (
    <div className='w-full flex justify-center items-center'>
        <div style={{backgroundColor: bgColor, opacity: bgOpacity}} className={`w-full flex items-center justify-center px-2 sm:w-[60%] md:w-[50%] min-h-[400px]`}>
            <div>
                <input
                className={``}
                type="text" placeholder='Write something....' name="" id="" />
            </div>
        </div>
    </div>
  )
}

export default StoryText