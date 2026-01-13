"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import React from 'react';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // Let Sonner follow the current system/user theme preference
      theme={"system" as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
