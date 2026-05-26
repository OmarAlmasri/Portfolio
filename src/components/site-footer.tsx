import Link from "next/link";

type SiteFooterProps = {
  name: string;
  socials: Array<{ label: string; href: string }>;
};

export function SiteFooter({ name, socials }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="shell footer-shell">
        <div>
          <p className="footer-title">{name}</p>
          <p className="footer-copy">
            Offensive security portfolio, project archive, and field notes.
          </p>
        </div>

        <div className="footer-links">
          {socials.map((social) => (
            <Link key={social.label} href={social.href} target="_blank" rel="noreferrer">
              {social.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
