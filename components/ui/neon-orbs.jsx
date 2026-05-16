"use client";

import React from 'react';

export const NeonOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[20%] right-[15%] w-[20%] h-[20%] rounded-full bg-primary/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};
