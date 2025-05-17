
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const SidebarMenuPrefix = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & { asChild?: boolean }
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-prefix"
      className={cn(
        "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuPrefix.displayName = "SidebarMenuPrefix"

const SidebarMenuSuffix = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & { asChild?: boolean }
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-suffix"
      className={cn(
        "flex-1 text-right group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSuffix.displayName = "SidebarMenuSuffix"

export { SidebarMenuPrefix, SidebarMenuSuffix }
