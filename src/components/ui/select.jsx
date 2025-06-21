import React from "react";
import { cn } from "../../utils";

const Select = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative">
      <button
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 opacity-50"
        >
          <path
            d="m4.93179 5.43179c.20264-.20264.53043-.20264.73307 0l2.83864 2.83864 2.83864-2.83864c.20264-.20264.53043-.20264.73307 0 .20264.20264.20264.53043 0 .73307l-3.17517 3.17517c-.20264.20264-.53043.20264-.73307 0l-3.17517-3.17517c-.20264-.20264-.20264-.53043 0-.73307z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
});

const SelectValue = ({ placeholder, value }) => (
  <span>{value || placeholder}</span>
);

const SelectContent = ({ children, value, onValueChange }) => (
  <div className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
    <div className="p-1">
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  </div>
);

const SelectItem = ({ children, value: itemValue, value, onValueChange, ...props }) => (
  <div
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    onClick={() => onValueChange?.(itemValue)}
    {...props}
  >
    {children}
  </div>
);

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };