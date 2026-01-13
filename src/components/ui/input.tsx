import React from "react";
// import { FiAlertCircle } from "react-icons/fi";

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  errorMessage,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Label */}
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-1.5 border ${
            errorMessage ? "border-red-500" : "border-gray-300"
          } rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
            errorMessage ? "focus:ring-red-500" : "focus:ring-blue-500"
          } ${icon ? "pl-10" : ""}`} // Adjust padding if there's an icon
        />
      </div>

      {/* Error Message */}
      {/* {errorMessage && (
        <div className="flex items-center mt-1 text-sm text-red-500">
          <FiAlertCircle className="mr-1" /> {errorMessage}
        </div>
      )} */}
    </div>
  );
};

export default InputField;
