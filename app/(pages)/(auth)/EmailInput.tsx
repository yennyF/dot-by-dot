interface EmailInputProps {
  id: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onValid?: (valid: boolean) => void;
}

export default function EmailInput({
  id,
  value,
  onValueChange,
  onValid,
}: EmailInputProps) {
  return (
    <input
      id={id}
      name={id}
      value={value}
      type="email"
      autoComplete=""
      className="w-full bg-white"
      onChange={(event) => {
        const value = event.target.value;
        onValueChange?.(value);
        onValid?.(value.length === 0 || validateEmail(value));
      }}
    />
  );
}

const validateEmail = (email: string) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return regex.test(email);
};
