import { HeroScene } from "@/components/hero-scene";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  summary: string;
  stats: Array<{ label: string; value: string }>;
};

export function PageHero({ eyebrow, title, summary, stats }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="shell page-hero-grid">
        <div className="page-hero-copy panel">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{summary}</p>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="page-hero-visual panel">
          <HeroScene compact />
        </div>
      </div>
    </section>
  );
}
