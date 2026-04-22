// src/components/auth/OtpInput.jsx
// 6-cell OTP grid with auto-advance, backspace, and paste support.

import { useRef } from 'react';

const LENGTH = 6;

/**
 * @param {{
 *   value:    string,          // full OTP string e.g. "483920"
 *   onChange: (v: string) => void,
 *   disabled: boolean,
 * }} props
 */
export default function OtpInput({ value, onChange, disabled }) {
  const cells = value.split('').concat(Array(LENGTH).fill('')).slice(0, LENGTH);
  const refs  = useRef([]);

  function focus(index) {
    refs.current[index]?.focus();
  }

  function handleChange(e, index) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next  = cells.slice();
    next[index] = char;
    onChange(next.join(''));
    if (char && index < LENGTH - 1) focus(index + 1);
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      if (cells[index]) {
        const next = cells.slice();
        next[index] = '';
        onChange(next.join(''));
      } else if (index > 0) {
        focus(index - 1);
      }
    }
    if (e.key === 'ArrowLeft' && index > 0)          focus(index - 1);
    if (e.key === 'ArrowRight' && index < LENGTH - 1) focus(index + 1);
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    onChange(pasted.padEnd(LENGTH, '').slice(0, LENGTH));
    focus(Math.min(pasted.length, LENGTH - 1));
  }

  return (
    <div className="otp-grid" onPaste={handlePaste}>
      {cells.map((char, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className={`otp-cell${char ? ' filled' : ''}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={char}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          autoFocus={i === 0}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
