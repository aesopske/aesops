import React from "react"
import {
  HoverCardContent,
  HoverCardTrigger,
  HoverCard as HoverCardComponent,
} from "../ui/hover-card"

type HoverCardProps = {
  hideDetails?: boolean
  children: React.ReactNode
  renderTrigger?: () => React.ReactNode
}

export function HoverCard({
  children,
  renderTrigger,
  hideDetails = false,
}: HoverCardProps) {
  if (hideDetails && typeof renderTrigger === "function") {
    return renderTrigger()
  }
  return (
    <HoverCardComponent>
      <HoverCardTrigger asChild>
        {renderTrigger ? renderTrigger() : null}
      </HoverCardTrigger>
      <HoverCardContent className="bg-brand-background">
        {children}
      </HoverCardContent>
    </HoverCardComponent>
  )
}
