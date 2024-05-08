import React from "react";

export const SearchIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9 4C11.7614 4 14 6.23858 14 9M14.6588 
            14.6549L19 19M17 9C17 13.4183 13.4183 
            17 9 17C4.58172 17 1 13.4183 1 9C1 
            4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
        stroke="var(--color-fg1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
