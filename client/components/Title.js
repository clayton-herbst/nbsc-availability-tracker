import React from "react";

export default props => {
  if (typeof props.title === "undefined") props.title = "";

  return (
    <h1
      className={
        "font-weight-bold text-monospace text-center " + props.className
      }
      style={props.style}
    >
      {props.title}
    </h1>
  );
};
