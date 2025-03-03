"use client";

import React, { useState, useRef } from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-md">
      {children}
    </button>
  );
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, isOpen }) => {
  return (
    isOpen && (
      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white border p-1">
        {children}
      </div>
    )
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
    >
      {children}
    </div>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
