import React from "react";
import { cn } from "../../utils";

const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

const DropdownMenuTrigger = ({ asChild, children, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div>
      {React.cloneElement(children, {
        onClick: () => setIsOpen(!isOpen),
        ...props
      })}
    </div>
  );
};

const DropdownMenuContent = ({ align = "center", className, children, ...props }) => (
  <div
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      align === "end" && "right-0",
      align === "start" && "left-0",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuItem = ({ className, children, ...props }) => (
  <div
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuSeparator = ({ className, ...props }) => (
  <div
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};