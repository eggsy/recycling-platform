import { useState } from "react";
import { TbX } from "react-icons/tb";
import { Input } from "./Input";

export const InputGroup = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string[];
  setValue: any;
}) => {
  const [activeValue, setActive] = useState("");

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setValue([...value, activeValue]);
      setActive("");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-semibold uppercase text-black/50">
        {label}
      </label>

      <div className="space-y-1">
        {value.map((val, index) => (
          <div key={val} className="flex items-center space-x-2">
            <Input
              key={val}
              value={val}
              placeholder={placeholder}
              grow
              disabled
            />

            <button
              type="button"
              title="Delete"
              aria-label="Delete this item"
              className="rounded-lg bg-red-600/20 p-1.5 text-2xl text-red-600 transition-colors hover:bg-red-600/40"
              onClick={() => {
                setValue(value.filter((_, i) => i !== index));
              }}
            >
              <TbX />
            </button>
          </div>
        ))}

        <Input
          value={activeValue}
          setValue={setActive}
          placeholder={placeholder}
          onKeyDown={handleEnter}
        />
      </div>

      <span className="mt-2 block text-center text-xs text-black/30">
        press enter to add more
      </span>
    </div>
  );
};
