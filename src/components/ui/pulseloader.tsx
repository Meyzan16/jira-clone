"use client";
import React, { FC } from "react";

interface Props {
    text?: string;
    color?: string;
    loading: boolean;
    size?: number;
}

const PulseLoader: FC<Props> = ({ text, color, loading, size = 10 }) => {
    if (!loading) return null;
  
    return (
      <div className="flex items-center gap-2">
        {text && <span style={{ color }}>{text}</span>} 
        <div className="flex space-x-1" data-testid="loader">
          <span
            style={{ backgroundColor: color, width: size, height: size }}
            className="animate-bounce rounded-full"
          />
          <span
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              animationDelay: '150ms',
            }}
            className="animate-bounce rounded-full"
          />
          <span
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              animationDelay: '300ms',
            }}
            className="animate-bounce rounded-full"
          />
        </div>
      </div>
    );
  };
  
  export default PulseLoader;