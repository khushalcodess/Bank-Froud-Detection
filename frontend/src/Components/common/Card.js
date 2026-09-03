import React from "react";

function Card({
  children,
  title,
  subtitle,
  className = "",
  padding = "medium",
}) {
  return (
    <div className={`fg-card fg-card-${padding} ${className}`}>
      {title && (
        <div className="fg-card-header">
          <div>
            <h3 className="fg-card-title">{title}</h3>

            {subtitle && (
              <p className="fg-card-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="fg-card-body">
        {children}
      </div>
    </div>
  );
}

export default Card;