import * as React from "react";
import { useState } from "react";
import { Input } from './Input';
import { InputProps } from "@plug/ui";
import PasswordIcon from "../../assets/icons/password.svg";
import HidePasswordIcon from "../../assets/icons/password_hide.svg";

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {setPasswordVisible(!passwordVisible);};
  
  const passwordIcon = ({ iconColor, isFocused }: { iconColor: string, isFocused: boolean }) => {
    if (props.invalid || isFocused) {
      const PasswordIconComponent = PasswordIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
      const HidePasswordIconComponent = HidePasswordIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
      
      return (
        <button 
          type="button" 
          className="pr-2" 
          onClick={togglePasswordVisibility}
          onMouseDown={(e) => {e.preventDefault();}}
        >
          {!passwordVisible ? 
            <HidePasswordIconComponent fill={iconColor}/> : 
            <PasswordIconComponent fill={iconColor}/>
          }
        </button>
      );
    }
    return null;
  };
  
  return (
    <Input 
      {...props} 
      type={passwordVisible ? 'text' : 'password'} 
      renderIcon={passwordIcon}
      iconPosition="trailing"
      iconSvg={passwordVisible ? PasswordIcon : HidePasswordIcon}
      ref={ref} 
    />
  );
});

InputPassword.displayName = 'InputPassword';

export { InputPassword };
