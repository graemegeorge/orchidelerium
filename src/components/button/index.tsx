"use client";

import { AnchorHTMLAttributes } from "react";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const ButtonLink = ({ href, ...props }: ButtonLinkProps) => {
  return <a href={href} {...props} />;
};
