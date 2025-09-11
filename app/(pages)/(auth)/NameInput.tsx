import { useEffect, useState } from "react";

interface TextInputProps {
  id: string;
  onValidChange?: (valid: boolean) => void;
}

export default function NameInput({ id, onValidChange }: TextInputProps) {
  const [inputValue, setInputValue] = useState<string>();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const isValid = inputValue !== undefined && inputValue.length === 0;
    setIsValid(isValid);
    onValidChange?.(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <label htmlFor={id} className="label-auth">
        Name <span className="required">*</span>
      </label>
      <input
        id={id}
        name={id}
        type="text"
        autoComplete=""
        className="w-full bg-white"
        value={inputValue ?? ""}
        onChange={(event) => {
          setInputValue(event.target.value);

          const isValid = inputValue !== undefined && inputValue.length === 0;
          setIsValid(isValid);
          onValidChange?.(isValid);
        }}
      />
      {!isValid && <div className="required-input">Required</div>}
    </div>
  );
}
