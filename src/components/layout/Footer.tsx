import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const brandName = "AG Solutions";
  const brandLink = "https://www.ag-solutions.in";

  return (
    <footer className="py-4">
      <p className="flex flex-wrap items-center justify-center gap-1 text-center text-label-sm text-on-surface-variant">
        Copyright © 2024–{year} by{" "}
        <a href={brandLink} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
          {brandName}
        </a>
        . All rights reserved. Crafted with
        <Heart className="size-3.5 fill-tertiary text-tertiary" aria-hidden />
      </p>
    </footer>
  );
}

export default Footer;
