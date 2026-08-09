import type { ReactNode } from "react";

type ErrorMessageProps = {
  children: ReactNode;
};

export const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return (
    <p className="bg-red-50 text-red-600 p-2 uppercase text-xs font-bold m-2 rounded">
      {children}
    </p>
  );
};
