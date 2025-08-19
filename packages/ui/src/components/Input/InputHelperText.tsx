import { cn } from "../../utils/classname";
import { InputHelperTextProps } from "./Input.types";

const InputHelperText = ({
  children,
  id,
  error = false,
  className,
  ref,
  ...props
}: InputHelperTextProps) => {

  return (
    <p
      ref={ref}
      id={id}
      className={cn(
          "text-xs mt-1",
          error ? "text-red-500 font-medium" : "text-slate-500",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

InputHelperText.displayName = 'InputHelperText';

export { InputHelperText }; 