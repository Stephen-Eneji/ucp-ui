import React from "react";

export default function PricePercentage({ percentage , ...props}) {
    const isPositive = percentage > 0;
    const arrow = isPositive ? "up" : "down";
    return (
      <div
        {...props}
         style={{ color: isPositive ? "green" : "red", ...props.styles }}
      >
        <i className={`fa-solid fa-arrow-${arrow}`}></i>
        {percentage}
      </div>
    );
}
    