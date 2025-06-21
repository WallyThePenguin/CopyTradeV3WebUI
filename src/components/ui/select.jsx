import React from "react";
import { cn } from "../../utils";

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleToggle = () => setIsOpen((open) => !open);
  const handleClose = () => setIsOpen(false);

  // Enhance children with isOpen, toggle, and close props
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        // Pass isOpen, toggle, and close to trigger/content
        return React.cloneElement(child, {
          value,
          onValueChange,
          isOpen,
          onToggle: handleToggle,
          onClose: handleClose,
        });
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef(
  ({ className, children, isOpen, onToggle, ...props }, ref) => (
    <div className="relative">
      <button
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        onClick={onToggle}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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
  )
);

const SelectValue = ({ placeholder, value }) => (
  <span>{value || placeholder}</span>
);

const SelectContent = ({ children, isOpen, onClose, value, onValueChange }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (!e.target.closest('.select-dropdown-content')) onClose?.();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="select-dropdown-content absolute left-0 z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-2xl mt-1" style={{ minWidth: '100%' }}>
      <div className="p-1">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { value, onValueChange, onClose })
        )}
      </div>
    </div>
  );
};

const SelectItem = ({ children, value: itemValue, value, onValueChange, onClose, ...props }) => (
  <div
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    onClick={() => {
      onValueChange?.(itemValue);
      onClose?.();
    }}
    role="option"
    aria-selected={value === itemValue}
    tabIndex={0}
    {...props}
  >
    {children}
  </div>
);

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };