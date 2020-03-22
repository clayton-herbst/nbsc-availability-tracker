import React from "react"

interface Title {
  title: string;
  size: string;
  className?: string;
  style?: object
}
export default (props: Title) => {
  if (typeof props.title === "undefined") props.title = ""


  if(props.size === "lg")
    return (
      <div className="m-auto">
        <h1
          className={`font-weight-bold text-monospace text-center w-100 ${props.className}`}
          style={props.style}
        >
          {props.title}
        </h1>
      </div>
    )
  else if(props.size === "sm")
    return (
      <div className="m-auto">
        <h4
          className={`font-weight-bold text-monospace text-center w-100 ${props.className}`}
          style={props.style}
        >
          {props.title}
        </h4>
      </div>
    )
}
