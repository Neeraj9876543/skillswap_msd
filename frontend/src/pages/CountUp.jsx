import React from "react";
import ReactCountUp from "react-countup";
export const CountUp = ({
  value,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  animationStyle = "easeOut",
  colorScheme = "default",
  customColor,
}) => {
  const getColor = () => {
    if (customColor) return customColor;
    switch (colorScheme) {
      case "primary":
        return "#f43f5e";
      case "secondary":
        return "#3b82f6";
      case "custom":
        return "#fff";
      default:
        return "#111827";
    }
  };
  return (
    <ReactCountUp
      start={0}
      end={value}
      duration={duration}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
    >
      {({ countUpRef }) => (
        <span ref={countUpRef} style={{ color: getColor(), fontWeight: 500 }} />
      )}
    </ReactCountUp>
  );
};
