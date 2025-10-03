import { useEffect, useState } from "react";

interface TextInputProps {
  id: string;
  onValidChange?: (valid: boolean, id: string) => void;
  onValueChange?: (value: string) => void;
}

export default function NameInput({
  id,
  onValidChange,
  onValueChange,
}: TextInputProps) {
  const [isValidRequired, setIsValidRequired] = useState(false);

  useEffect(() => {
    onValidChange?.(isValidRequired, id);
  }, [isValidRequired, id, onValidChange]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="label-auth flex justify-between">
        Name
        {!isValidRequired && <div className="valid-required">Required</div>}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        autoComplete=""
        className="w-full bg-white"
        onChange={(event) => {
          const value = event.target.value;
          setIsValidRequired(value.length > 0);
          onValueChange?.(value);
        }}
      />
    </div>
  );
}
