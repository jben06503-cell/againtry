import * as React from "react";
import { clsx } from "clsx";
const Toast = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
    return (<div ref={ref} className={clsx("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all", {
            "border bg-background text-foreground": variant === "default",
            "destructive group border-destructive bg-destructive text-destructive-foreground": variant === "destructive",
        }, className)} {...props}/>);
});
Toast.displayName = "Toast";
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={clsx("text-sm font-semibold", className)} {...props}/>));
ToastTitle.displayName = "ToastTitle";
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={clsx("text-sm opacity-90", className)} {...props}/>));
ToastDescription.displayName = "ToastDescription";
export { Toast, ToastTitle, ToastDescription };
