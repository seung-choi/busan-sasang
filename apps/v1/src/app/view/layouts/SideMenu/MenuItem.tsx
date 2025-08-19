
interface MenuItemProps {
  id: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCurrentPanel?: boolean;
  onClick: (id: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ id, icon, isActive, isCurrentPanel, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(id);
  };
  return (
    <button
      onClick={handleClick}
      className={`
        group flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-200 cursor-pointer
        ${isActive
        ? 'bg-gradient-to-br from-primary-500/40 to-primary-600/50 shadow-lg shadow-primary-500/30 border-2 border-primary-400/60 ring-2 ring-primary-400/20'
        : 'bg-primary-300/10 border-none hover:bg-primary-300/30'
      }
        ${isCurrentPanel
        ? 'brightness-150'
        : ''
      }
      `}
    >
      <img
        src={icon as string}
        alt="Menu Icon"
        className={`
          w-6 h-6 transition-all duration-200
          brightness-150
          ${isActive 
            ? 'scale-125 brightness-[2.5] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
            : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'
          }
        `}
      />
    </button>
  );
};

export default MenuItem;