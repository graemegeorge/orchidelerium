"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  target?: string;
}

export const ButtonLink = ({
  href,
  target = "_self",
  ...props
}: ButtonLinkProps) => {
  return (
    <button
      type="button"
      onClick={() => window.open(href, target)}
      {...props}
    />
  );
};
