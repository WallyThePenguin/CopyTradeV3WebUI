import React from "react";
import { cn } from "../../utils";

const Tabs = ({ value, onValueChange, children, className, ...props }) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

const TabsList = ({ children, value, onValueChange, className, ...props }) => (
  <div
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  >
    {React.Children.map(children, child =>
      React.cloneElement(child, { value, onValueChange })
    )}
  </div>
);

const TabsTrigger = ({ children, value: triggerValue, value, onValueChange, className, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      value === triggerValue
        ? "bg-background text-foreground shadow"
        : "hover:bg-muted/50",
      className
    )}
    onClick={() => onValueChange?.(triggerValue)}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value: contentValue, value, className, ...props }) => {
  if (value !== contentValue) return null;
  
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };