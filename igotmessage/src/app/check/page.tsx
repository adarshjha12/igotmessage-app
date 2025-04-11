'use client'
import { useState } from "react";

type OtpTYpe = {
    length: number,
    onChange: (value: string) => void
}

const OTPInput = ({ length = 6, onChange } : OtpTYpe) => {
    const [value, setValue] = useState('');
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\D/g, '').slice(0, length); // digits only
      setValue(input);
      onChange?.(input);
    };
  
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {/* Hidden real input */}
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={value}
          onChange={handleChange}
          maxLength={length}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
  
        {/* Fake boxes showing each digit */}
        {[...Array(length)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '2rem',
              height: '2.5rem',
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              backgroundColor: '#fff',
              borderRadius: '4px',
            }}
          >
            {value[i] || ''}
          </div>
        ))}
  
        {/* Overlay a transparent clickable input area to focus real input */}
        <div
          onClick={() => {
            const input = document.querySelector('#hiddenOtpInput') as HTMLInputElement;
            input?.focus();
          }}
          style={{
            position: 'absolute',
            width: `${length * 2.5}rem`,
            height: '2.5rem',
            cursor: 'text',
          }}
        />
      </div>
    );
  };
  
  export default OTPInput