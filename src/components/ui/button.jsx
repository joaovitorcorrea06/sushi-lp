import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-[0.16em] uppercase transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] px-6 py-3 text-[var(--color-ink)] shadow-[0_18px_50px_rgba(244,155,56,0.32)] hover:-translate-y-0.5 hover:bg-[var(--color-accent-soft)]",
        secondary:
          "border border-white/20 bg-white/6 px-6 py-3 text-[var(--color-cream)] backdrop-blur-xl hover:border-white/40 hover:bg-white/10",
        ghost:
          "px-0 py-0 text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]",
      },
      size: {
        default: "",
        lg: "px-7 py-4 text-[0.78rem]",
        sm: "px-4 py-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
