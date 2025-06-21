import React from "react";

export function Avatar({ src, alt = "", className = "", children }) {
    return (
        <span className={`inline-flex items-center justify-center rounded-full bg-gray-700 text-white w-10 h-10 ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
            ) : (
                children || <span>{alt ? alt[0] : "?"}</span>
            )}
        </span>
    );
}

export function AvatarFallback({ children }) {
    return <span>{children}</span>;
}
