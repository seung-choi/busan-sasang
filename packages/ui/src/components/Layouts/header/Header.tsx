import clsx from 'clsx';

export interface HeaderProps {
  logoSrc?: string;
  onLogoClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const Header = ({ logoSrc = '/logo.png', onLogoClick, children, className }: HeaderProps) => (
  <header className={clsx("text-blue-500 p-4 flex items-center justify-between border-b border-gray-200", className)}>
    <button onClick={onLogoClick} className="text-xl font-bold">
      <img src={logoSrc} alt="Logo" className="inline-block mr-2" />
    </button>
    {children && <div>{children}</div>}
  </header>
);

export default Header;