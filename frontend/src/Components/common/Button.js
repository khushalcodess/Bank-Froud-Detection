import React from "react";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`fg-button fg-button-${variant} fg-button-${size} ${
        fullWidth ? "fg-button-full" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;