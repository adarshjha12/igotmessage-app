import React from "react";

function Button({ text }: { text: string }) {
  const baseButton = `
  flex items-center justify-center gap-3
  w-full max-w-[320px] py-2 px-5
  rounded-2xl border-2
  transition-all duration-200 ease-in-out
  text-lg font-medium
  hover:scale-[1.03] active:scale-[0.97]
  shadow-md hover:shadow-lg
  hover:border-yellow-400 cursor-pointer
  bg-gray-800 text-white
  border-gray-600 
`;
  return (
    <div>
      <button
        type="button"
        // onClick={handleGuestSignin}
        className={`${baseButton}`}
      >
        {text}
      </button>
    </div>
  );
}

export default Button;
