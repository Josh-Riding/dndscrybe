// src/_components/Button.tsx
import type { ComponentProps } from "react";

const Button = ({ className, ...props }: ComponentProps<"button">) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-black shadow transition-colors ${className}`}
      {...props}
    />
  );
};

export default Button;
