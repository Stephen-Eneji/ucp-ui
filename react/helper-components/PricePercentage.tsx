import { ArrowDown, ArrowUp } from "iconsax-react";
import React, { CSSProperties, HTMLAttributes } from "react";

interface PricePercentageProps extends HTMLAttributes<HTMLDivElement> {
  percentage: number;
  arrowSize?: number;
  styles?: CSSProperties;
}

const PricePercentage: React.FC<PricePercentageProps> = ({
  percentage,
  arrowSize = 30,
  styles,
  ...props
}) => {
  const isPositive = percentage > 0;
  return (
    <div {...props} style={{ color: isPositive ? "green" : "red", ...styles }}>
      {isPositive ? (
        <ArrowUp size={arrowSize} color="green" />
      ) : (
        <ArrowDown size={arrowSize} color="red" />
      )}
      {percentage}
    </div>
  );
};

export default PricePercentage;
