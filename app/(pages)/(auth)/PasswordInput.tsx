import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

interface PasswordInputProps {
  id: string;
  onValidChange?: (valid: boolean) => void;
}

export function PasswordInputSignUp({ id, onValidChange }: PasswordInputProps) {
  const [show, setShow] = useState(false);
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
        Password <span className="required">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete=""
          className="w-full bg-white pr-[30px]"
          value={inputValue ?? ""}
          onChange={(event) => {
            setInputValue(event.target.value);

            const isValid = inputValue !== undefined && inputValue.length === 0;
            setIsValid(isValid);
            onValidChange?.(isValid);
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
      {!isValid && <div className="required-input">Min 6 characters</div>}
    </div>
  );
}

export function PasswordInputLogin({ id }: PasswordInputProps) {
  const [show, setShow] = useState(false);

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
          className="w-full bg-white pr-[30px]"
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
