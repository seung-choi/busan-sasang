import * as React from "react";
import { useId } from "react";
import { cn } from "../../utils/classname";
import { InputHelperText } from "./InputHelperText";
import { InputLabel } from "./InputLabel";
import { InputText } from "./InputText";
import { InputPassword } from "./InputPassword";

const InputBox = ({
  children,
  className,
  ref,
  ...props
}: React.ComponentProps<'div'>) => {

  const uniqueId = useId();
  const inputId = `input-${uniqueId}`;
  const helperId = `helper-${uniqueId}`;
  
  const inputChildren = React.Children.toArray(children);
  const inputHelperTexts = inputChildren.filter(child => React.isValidElement(child) && child.type === InputHelperText);
  const inputElements = inputChildren.filter( child => !(React.isValidElement(child) && child.type === InputHelperText));
  
  const elementProps = inputElements.map(child => {
    if (!React.isValidElement(child)) return child;
    
    if (child.type === InputLabel) {
      return React.cloneElement(child as React.ReactElement<HTMLLabelElement>, { 
        htmlFor: inputId,
        ...Object(child.props)
      });
    } else if (child.type === InputText || child.type === InputPassword) {
      return React.cloneElement(child as React.ReactElement<HTMLInputElement>, { 
        id: inputId,
        "aria-describedby": inputHelperTexts.length > 0 ? helperId : '',
        ...Object(child.props)
      });
    }
  });
  
  const helperTextsProp = inputHelperTexts.map(child => {
    if (!React.isValidElement(child)) return child;
    
    return React.cloneElement(child as React.ReactElement<HTMLParagraphElement>, { 
      id: helperId,
      ...Object(child.props)
    });
  });
  
  return (
      <div
          ref={ref}
          className={cn("flex flex-col gap-1.5 w-full", className)}
          {...props}
      >
        {elementProps}
        {helperTextsProp}
      </div>
  );
};

InputBox.displayName = 'InputBox';

export { InputBox }; 