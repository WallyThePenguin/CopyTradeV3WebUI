import React from "react";

export function Progress({ value = 0, max = 100, className = "" }) {
    return (
        <div className={`w-full bg-gray-800 rounded-full h-2.5 ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
            <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
            />
        </div>
    );
}
