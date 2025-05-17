
import * as React from "react"
import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const SidebarMenuButton = forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    isActive?: boolean
    size?: "sm" | "md"
  }
>(({ asChild = false, isActive, size = "md", className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex min-w-0 items-center space-x-2 rounded-md px-3 py-1 text-sidebar-foreground outline-none ring-sidebar-ring focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs [&>svg]:size-3",
        size === "md" && "text-sm [&>svg]:size-4",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export { SidebarMenuButton }
