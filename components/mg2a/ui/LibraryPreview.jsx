"use client";

export default function LibraryPreview({ children }) {
  return (
    <div
      onSubmitCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClickCapture={(event) => {
        if (event.target.closest("a")) event.preventDefault();
      }}
    >
      {children}
    </div>
  );
}
