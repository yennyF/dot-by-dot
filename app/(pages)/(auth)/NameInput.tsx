interface TextInputProps {
  id: string;
  onValueChange?: (value: string) => void;
}

export default function NameInput({ id, onValueChange }: TextInputProps) {
  return (
    <input
      id={id}
      name={id}
      type="text"
      autoComplete=""
      className="w-full bg-white"
      onChange={(event) => {
        const value = event.target.value;
        onValueChange?.(value);
      }}
    />
  );
}
