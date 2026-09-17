import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const ToggleSwitch = ({ isActive, onToggle, label }: ToggleSwitchProps) => {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span className="relative inline-block">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={isActive}
          onChange={onToggle}
          aria-label={label ?? "Toggle status"}
        />
        <span
          aria-hidden
          className={cn(
            "block h-5 w-9 rounded-full transition-colors duration-200",
            "bg-surface-container-highest peer-focus-visible:outline-[3px] peer-focus-visible:outline-primary-container",
            "peer-checked:bg-emerald-600"
          )}
        />
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200",
            isActive && "translate-x-4"
          )}
        />
      </span>
      {label ? <span className="text-label-sm text-on-surface">{label}</span> : null}
    </label>
  );
};

export default ToggleSwitch;
