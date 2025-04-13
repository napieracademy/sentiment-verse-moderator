
import React from "react";

interface LogoProps {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-shrink-0 w-8 h-8">
        <img 
          src="/lovable-uploads/09365763-15f3-4aa8-b893-896ae94d380c.png" 
          alt="Logo Gatto" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {!collapsed && (
        <span className="font-bold text-lg text-sidebar-foreground whitespace-nowrap overflow-hidden">
          CatAdmin
        </span>
      )}
    </div>
  );
};

export default Logo;
