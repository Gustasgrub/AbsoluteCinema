import { useRef } from 'react';

// 6 langeliai 2FA kodui. Galima rašyti po skaitmenį arba įklijuoti visą kodą.
export default function OtpInput({ value, onChange, label = 'Authentication code' }) {
  const inputs = useRef([]);

  function focusBox(index) {
    inputs.current[Math.max(0, Math.min(index, 5))]?.focus();
  }

  function handleInput(index, event) {
    const digit = event.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const next = (value.slice(0, index) + digit).slice(0, 6);
    onChange(next);
    focusBox(next.length);
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      onChange(value.slice(0, -1));
      focusBox(value.length - 1);
    }
  }

  function handlePaste(event) {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits) {
      event.preventDefault();
      onChange(digits);
      focusBox(digits.length);
    }
  }

  return (
    <div className="otp" role="group" aria-label={label}>
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          className="otp__box"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          value={value[index] ?? ''}
          onChange={(event) => handleInput(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={() => index > value.length && focusBox(value.length)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
