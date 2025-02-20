import { FC, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface InputProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  id: string;
  errors?: string;
  touched?: boolean;
}

const Input: FC<InputProps> = ({
  id,
  label,
  placeholder,
  type,
  value,
  onChange,
  errors,
  touched,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordInput = type === "password";

  const isFilledOrFocused = value.length > 0;

  return (
    <div className={`relative w-full ${errors && touched ? "mb-4" : "mb-4"}`}>
        <label
            className={`absolute left-4 transition-all duration-300 ${
            isFilledOrFocused
                ? "-top-3 text-sm bg-white px-2 text-gray-600"
                : "top-4 text-gray-400"
            }`}
            htmlFor={id}
        >
            {label}
        </label>

        <input
            id={id}
            type={isPasswordInput ? (showPassword ? "text" : "password") : type}
            value={value}
            onChange={onChange}
            aria-label={label}
            className={`w-full px-4 py-4 border rounded-full  text-black 
                        font-poppins text-md font-semibold 
                        focus:outline-none focus:border-primary bg-white
                        ${errors && touched ? "border-red-500" : "border-gray-300"}`}
        />

        
        {isPasswordInput && (
            <span
            className="absolute bottom-3 right-3 cursor-pointer text-black z-10"
            onClick={() => setShowPassword((prev) => !prev)}
            >
            {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </span>
        )}

        {errors && touched && (
            <span className="text-red-500 block font-poppins text-base mt-2">{errors}</span>
        )}

    </div>
  );

};

export default Input;
