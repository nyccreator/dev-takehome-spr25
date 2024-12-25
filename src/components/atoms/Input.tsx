import React from "react";

type InputVariant = "primary";

interface InputProps {
  variant?: InputVariant;
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

export default function Input({
  variant = "primary",
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
}: InputProps) {
  const baseStyles = "py-2 px-4 rounded-md transition w-full";

  const variantStyles: Record<InputVariant, string> = {
    primary: "bg-primary-fill text-xs focus:outline-primary-stroke",
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      className={`${baseStyles} ${variantStyles[variant]}`}
    />
  );
}