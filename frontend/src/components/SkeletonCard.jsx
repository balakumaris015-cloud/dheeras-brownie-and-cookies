import React from "react";

export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[2rem] border border-cocoa-200 bg-white">
      <div className="aspect-[4/3] bg-cocoa-100" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-24 rounded-full bg-cocoa-100" />
        <div className="h-8 w-3/4 rounded-full bg-cocoa-100" />
        <div className="space-y-2">
          <div className="h-4 rounded-full bg-cocoa-100" />
          <div className="h-4 w-5/6 rounded-full bg-cocoa-100" />
        </div>
        <div className="h-12 rounded-full bg-cocoa-100" />
      </div>
    </div>
  );
}
