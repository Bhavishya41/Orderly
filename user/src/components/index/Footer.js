import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center text-white/60 text-xs py-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
      &copy; {new Date().getFullYear()} Orderly. All rights reserved.

    </footer>
  );
}
