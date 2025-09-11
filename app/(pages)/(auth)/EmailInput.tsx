import { useEffect, useState } from "react";

interface EmailInputProps {
  required?: boolean;
  id: string;
  onValidChange?: (valid: boolean) => void;
}

export default function EmailInput({
  id,
  required,
  onValidChange,
}: EmailInputProps) {
  const [inputValue, setInputValue] = useState<string>();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (inputValue === undefined) return;

    const isValid = required && inputValue.length === 0 ? false : true;
    setIsValid(isValid);
    onValidChange?.(isValid);
  }, [inputValue, required, onValidChange]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="label-auth">
        Email {required && <span className="required">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type="email"
        autoComplete=""
        className="w-full bg-white"
        value={inputValue ?? ""}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
      />
      {!isValid && <div className="required-input">Required</div>}
    </div>
  );
}
