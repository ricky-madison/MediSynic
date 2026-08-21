
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import ProFeatureLock from "../ProFeatureLock"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withAction?: boolean
  actionLabel?: string
  onAction?: () => void
  isPro?: boolean
  proFeatureLabel?: string
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, withAction, actionLabel, onAction, isPro, proFeatureLabel, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      isPro && "relative",
      className
    )}
    {...props}
  >
    {isPro && (
      <div className="absolute -top-2 right-2">
        <ProFeatureLock feature={proFeatureLabel || "Pro Feature"} />
      </div>
    )}
    {props.children}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { withAction?: boolean; actionLabel?: string; onAction?: () => void }
>(({ className, withAction, actionLabel = "Get Started", onAction, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col sm:flex-row items-center p-4 sm:p-6 pt-0 gap-2", className)}
    {...props}
  >
    {withAction && (
      <Button 
        onClick={onAction} 
        className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
      >
        {actionLabel}
      </Button>
    )}
    {props.children}
  </div>
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
