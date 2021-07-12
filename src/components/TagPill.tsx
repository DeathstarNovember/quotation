import React from 'react'
import { Quote } from '../App'

export const TagPill = ({
  tag,
  quote,
  onClick,
  color,
}: {
  tag: string
  quote: Quote
  onClick: () => void
  color?: string
}) => {
  return (
    <div
      style={{
        borderRadius: 3,
        backgroundColor: color,
        padding: 5,
        cursor: 'pointer',
      }}
      key={quote._id + tag}
      onClick={onClick}
    >
      {tag}
    </div>
  )
}
