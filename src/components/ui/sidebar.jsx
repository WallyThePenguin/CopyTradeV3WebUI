import React from "react";
import { cn } from "../../utils";

const SidebarProvider = ({ children, ...props }) => (
  <div className="flex min-h-screen" {...props}>
    {children}
  </div>
);

const Sidebar = ({ className, children, ...props }) => (
  <div
    className={cn(
      "flex h-screen w-64 flex-col border-r bg-background",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const SidebarHeader = ({ className, children, ...props }) => (
  <div className={cn("flex items-center px-6 py-4", className)} {...props}>
    {children}
  </div>
);

const SidebarContent = ({ className, children, ...props }) => (
  <div className={cn("flex-1 overflow-auto", className)} {...props}>
    {children}
  </div>
);

const SidebarFooter = ({ className, children, ...props }) => (
  <div className={cn("mt-auto px-6 py-4", className)} {...props}>
    {children}
  </div>
);

const SidebarGroup = ({ className, children, ...props }) => (
  <div className={cn("space-y-2", className)} {...props}>
    {children}
  </div>
);

const SidebarGroupLabel = ({ className, children, ...props }) => (
  <div className={cn("px-2 py-1 text-xs font-medium text-muted-foreground", className)} {...props}>
    {children}
  </div>
);

const SidebarGroupContent = ({ className, children, ...props }) => (
  <div className={cn("space-y-1", className)} {...props}>
    {children}
  </div>
);

const SidebarMenu = ({ className, children, ...props }) => (
  <div className={cn("space-y-1", className)} {...props}>
    {children}
  </div>
);

const SidebarMenuItem = ({ className, children, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

const SidebarMenuButton = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      className={cn(
        "flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  );
});

const SidebarTrigger = ({ className, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9",
      className
    )}
    {...props}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
};