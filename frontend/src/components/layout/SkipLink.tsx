import React from "react";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gov-amber focus:text-gov-navy-dark focus:font-semibold focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gov-navy"
    >
      Skip to main content
    </a>
  );
}
