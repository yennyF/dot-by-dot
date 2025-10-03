import { validateEmail } from "@/app/utils/utils";
import { useEffect, useState } from "react";

interface EmailInputProps {
  id: string;
  onValidChange?: (valid: boolean, id: string) => void;
  onValueChange?: (value: string) => void;
}

export function EmailInputSignUp({
  id,
  onValidChange,
  onValueChange,
}: EmailInputProps) {
  const [isValidRequired, setIsValidRequired] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  useEffect(() => {
    onValidChange?.(isValidRequired && isValidEmail, id);
  }, [isValidRequired, isValidEmail, id, onValidChange]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="label-auth flex justify-between">
        Email
        {!isValidRequired && <div className="valid-required">Required</div>}
      </label>
      <input
        id={id}
        name={id}
        type="email"
        autoComplete=""
        className="w-full bg-white"
        onChange={(event) => {
          const value = event.target.value;
          setIsValidRequired(value.length > 0);
          setIsValidEmail(true);
          onValueChange?.(value);
        }}
        onBlur={(event) => {
          const value = event.target.value;
          setIsValidEmail(value.length === 0 || validateEmail(value));
        }}
      />
      {!isValidEmail && <div className="valid-email">Email is not valid</div>}
    </div>
  );
}

export function EmailInputLogin({
  id,
  onValidChange,
  onValueChange,
}: EmailInputProps) {
  const [isValidRequired, setIsValidRequired] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  useEffect(() => {
    onValidChange?.(isValidRequired && isValidEmail, id);
  }, [isValidRequired, isValidEmail, id, onValidChange]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="label-auth">
        Email
      </label>
      <input
        id={id}
        name={id}
        type="email"
        autoComplete=""
        className="w-full bg-white"
        onChange={(event) => {
          const value = event.target.value;
          setIsValidRequired(value.length > 0);
          setIsValidEmail(value.length === 0 || validateEmail(value));
          onValueChange?.(value);
        }}
      />
    </div>
  );
}
