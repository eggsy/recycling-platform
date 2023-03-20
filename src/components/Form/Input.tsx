import clsx from "clsx";

export const Input = ({
  label,
  placeholder,
  value,
  setValue,
  onKeyDown,
  disabled,
  grow,
}: {
  label?: string;
  placeholder: string;
  value: string;
  setValue?: any;
  disabled?: boolean;
  grow?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={clsx("flex flex-col space-y-1", grow && "flex-grow")}>
      {label && (
        <label className="text-xs font-semibold uppercase text-black/50">
          {label}
        </label>
      )}

      <input
        type="text"
        className="block w-full rounded-md border-black/30 text-sm outline-none transition-colors focus:border-black/50 focus:ring-0 disabled:cursor-not-allowed disabled:bg-white/50 disabled:text-black/50"
        onChange={(e) => setValue?.(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        disabled={disabled}
        value={value}
        required
      />
    </div>
  );
};
