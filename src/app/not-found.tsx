import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-block not-found-shell">
      <div className="shell narrow-shell panel">
        <p className="section-eyebrow">404 // missing-route</p>
        <h1>That route is outside the mapped surface.</h1>
        <p>The requested page does not exist in the current portfolio dataset.</p>
        <Link href="/" className="primary-button">
          Return to entrypoint
        </Link>
      </div>
    </section>
  );
}
