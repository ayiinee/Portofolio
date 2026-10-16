import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="footer">
      <Link href="/#top" className="brand" aria-label="Back to home">
        {profile.shortName}
        <span>.</span>
      </Link>
      <p>
        © {new Date().getUTCFullYear()} {profile.name}. Made with curiosity &
        intention.
      </p>
      <a href="#main-content" className="back-to-top">
        Back to top <ArrowUp size={14} />
      </a>
    </footer>
  );
}
