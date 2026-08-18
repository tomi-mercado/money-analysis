"use client";
import * as PopoverPrimitive from "@radix-ui/react-popover";
export const Popover=PopoverPrimitive.Root;
export const PopoverTrigger=PopoverPrimitive.Trigger;
export function PopoverContent({className="",...props}:React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>){return <PopoverPrimitive.Portal><PopoverPrimitive.Content side="bottom" align="start" sideOffset={6} collisionPadding={12} className={`popover-content ${className}`} {...props}/></PopoverPrimitive.Portal>}
