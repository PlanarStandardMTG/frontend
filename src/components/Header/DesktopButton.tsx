import React from "react";

const COLOR_CLASSES = {
  blue: 'bg-blue-600 shadow-blue-500/50 hover:bg-blue-700',
  purple: 'bg-purple-600 shadow-purple-500/50 hover:bg-purple-700',
  red: 'bg-red-600 shadow-red-500/50 hover:bg-red-700',
  green: 'bg-green-600 shadow-green-500/50 hover:bg-green-700',
  gray: 'bg-gray-600 shadow-gray-500/50 hover:bg-gray-700',
  orange: 'bg-orange-600 shadow-orange-500/50 hover:bg-orange-700',
};

interface DesktopButtonProps {
  icon: React.JSX.Element;
  label: string;
  onClick: () => void;
  color?: keyof typeof COLOR_CLASSES;
};

const DesktopButton = ({ icon, label, onClick, color }: DesktopButtonProps) => {
  const [hovered, setHovered] = React.useState<boolean>(false);
  const activeColor = color ? COLOR_CLASSES[color] : 'bg-gray-700 text-gray-100 hover:text-white';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200
        ${hovered ? `${activeColor} text-white scale-105 shadow-sm` : 'bg-gray-700 text-gray-100 hover:text-white'}`}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default DesktopButton;
