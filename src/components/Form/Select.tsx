export const Select = ({
  setValue, label, placeholder, options,
}: {
  value: string;
  setValue: any;
  label: string;
  placeholder: string;
  options?: { label: string; value: string; }[];
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs font-semibold uppercase text-black/50">
        {label}
      </label>

      <select
        className="block w-full rounded-md border-black/30 text-sm outline-none transition-colors focus:border-black/30 focus:ring-0"
        required
        title={placeholder}
        defaultValue={placeholder}
        onChange={(e) => setValue(e.target.value)}
      >
        <option disabled>{placeholder}</option>

        {options?.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
