import { ReactNode } from 'react';

export interface FooterProps {
  children?: ReactNode;
}

const Footer = ({ children }: FooterProps) => (
    <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        {!children && <>© 2025 Pluxity. All rights reserved.</>}
        {children && <div className="mt-2">{children}</div>}
    </footer>
);

export default Footer;