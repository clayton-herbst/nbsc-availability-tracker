/**
 * DEPRECATED
 */
import React from "react"

export default props => {
  if (typeof props.title === "undefined") props.title = ""

  return (
    <div className="mt-3">
      <h4
        className={"font-weight-bold text-monospace" + props.className}
        style={props.style}
      >
        {props.title}
      </h4>
    </div>
  )
}
