import { use, useId, useState } from "react";
import React from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", id: customId, ...props },
  ref
) {
  const generatedId = useId();
  const id = customId || generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`px-3 py-2 rounded-lg bg-white text-black outline-none
                    focus:bg-gray-50 duration-200 border border-blue-200 w-full ${className}`}
          ref={ref}
          {...props}
          id={id}
          autoComplete="off"
        />
        {isPassword && (
          <span
            className="absolute right-3 top-1/2  -translate-y-1/2 cursor-pointer text-gray-500 text-lg select-none"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        )}
      </div>
    </div>
  );
});

export default Input;
