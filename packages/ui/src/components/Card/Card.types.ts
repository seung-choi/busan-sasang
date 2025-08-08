export interface CardProps extends React.ComponentProps<'div'> {
  closable?: boolean;
  onClose?: () => void;
}