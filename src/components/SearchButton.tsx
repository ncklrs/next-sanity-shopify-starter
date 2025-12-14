"use client";

import { SearchIcon } from "@/components/icons";
import { useEffect, useState } from "react";

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
      aria-label="Search products"
    >
      <SearchIcon className="w-5 h-5" />

      <span className="hidden md:inline-flex items-center gap-2">
        <span>Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-xs font-mono text-[var(--foreground-muted)]">
          <span className="text-[10px]">{isMac ? "⌘" : "Ctrl"}</span>
          <span>K</span>
        </kbd>
      </span>
    </button>
  );
}
