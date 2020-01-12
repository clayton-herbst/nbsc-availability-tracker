import React from "react"

export default props => {
  if (typeof props.title === "undefined") props.title = ""

  return (
    <div className="m-auto">
      <h1
        className={
          "font-weight-bold text-monospace text-center w-100" + props.className
        }
        style={props.style}
      >
        {props.title}
      </h1>
    </div>
  )
}
