import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
};

const base = "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition";
const variants = {
  primary: "bg-moss text-white hover:bg-[#3f4f31]",
  secondary: "border border-moss text-moss hover:bg-moss hover:text-white"
};

export function Button({ href, children, className, variant = "primary", type = "button" }: Props) {
  if (href) {
    return (
      <Link href={href} className={cn(base, variants[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cn(base, variants[variant], className)}>
      {children}
    </button>
  );
}
