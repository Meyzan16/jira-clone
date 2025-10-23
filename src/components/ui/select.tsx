"use client";

import { FC, ChangeEvent } from "react";

interface OptionItem {
  id: string;
  name: string;
}

interface InterfaceSelect {
  placeholder: string;
  label: string; // ini jadi teks placeholder
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options?: OptionItem[];
  errors?: string;
  touched?: boolean;
}

const SelectComponent: FC<InterfaceSelect> = ({
  placeholder,
  label,
  value,
  onChange,
  options = [],
  errors,
  touched,
}) => {
  // const selectedOption = options.find((item) => item.id === value);

  return (
    <div className="relative space-y-2">
     <label
        className={`absolute left-4 transition-all duration-300 bg-white px-2`}
      >
        {label}
      </label>

      {/* Hanya tampilkan avatar kalau ada yang dipilih */}
      {/* {value && selectedOption && (
        <div className="flex items-center gap-x-2 px-2">
          <MemberAvatar
            name={selectedOption.name}
            className="size-6"
          />
          <span className="text-gray-800 text-sm font-medium">
            {selectedOption.name}
          </span>
        </div>
      )} */}

      <select
        value={value}
        onChange={onChange}
        className={`border w-full px-4 py-4 text-base rounded-full bg-white focus:outline-none ${
          errors && touched ? "border-red-500" : "border-gray-300"
        }`}
      >

        {/* Hanya render placeholder option jika belum ada yang dipilih */}
        {value === "" && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {/* Daftar member */}
        {options.map((optionItem) => (
          <option key={optionItem.id} value={optionItem.id}>
            {optionItem.name}
          </option>
        ))}
      </select>

      {/* Error */}
      {errors && touched && (
        <span className="text-red-500 block font-poppins text-base mt-2">
          {errors}
        </span>
      )}
    </div>
  );
};

export default SelectComponent;

