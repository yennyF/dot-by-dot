import { EyeOpenIcon, EyeClosedIcon, CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

interface PasswordInputProps {
  id: string;
  onValidChange?: (valid: boolean, id: string) => void;
}

export function PasswordInputSignUp({ id, onValidChange }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [isValidRequired, setIsValidRequired] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);

  useEffect(() => {
    onValidChange?.(isValidRequired && isValidLength, id);
  }, [isValidRequired, isValidLength, id, onValidChange]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="label-auth flex justify-between">
        Password
        {!isValidRequired && <div className="valid-required">Required</div>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          autoCorrect="false"
          spellCheck="false"
          className="w-full bg-white pr-[30px]"
          onChange={(event) => {
            const value = event.target.value;
            setIsValidRequired(value.length > 0);
            setIsValidLength(value.length >= 6);
          }}
        />
        <button
          type="button"
          className="absolute bottom-0 right-0 top-0 flex h-full w-[32px] items-center justify-center"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>
      <div className="valid-length flex gap-2">
        <span>Min 6 characters</span>
        {isValidLength && <CheckIcon className="text-[var(--green)]" />}
      </div>
    </div>
  );
}

export function PasswordInputLogin({ id, onValidChange }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [isValidRequired, setIsValidRequired] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);

  useEffect(() => {
    onValidChange?.(isValidRequired && isValidLength, id);
  }, [isValidRequired, isValidLength, id, onValidChange]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="label-auth">
        Password
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          autoCorrect="false"
          spellCheck="false"
          className="w-full bg-white pr-[30px]"
          onChange={(event) => {
            const value = event.target.value;
            setIsValidRequired(value.length > 0);
            setIsValidLength(value.length >= 6);
          }}
        />
        <button
          type="button"
          className="absolute bottom-0 right-0 top-0 flex h-full w-[32px] items-center justify-center"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    </div>
  );
}
