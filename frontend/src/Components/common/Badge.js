import React from "react";

function Badge({ children, variant = "default", size = "medium" }) {
  return (
    <span className={`fg-badge fg-badge-${variant} fg-badge-${size}`}>
      {children}
    </span>
  );
}

export default Badge;