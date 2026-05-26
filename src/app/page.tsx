import Image from "next/image";
import Link from "next/link";
import { HeroScene } from "@/components/hero-scene";
import { RotatingRoles } from "@/components/rotating-roles";
import { SectionHeading } from "@/components/section-heading";
import {
  getAbout,
  getAllPosts,
  getCapabilities,
  getContact,
  getExperience,
  getFeaturedPosts,
  getProjects,
  getProfile,
  getToolbox
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, about, capabilities, experience, projects, toolbox, contact, posts, featuredPosts] =
    await Promise.all([
      getProfile(),
      getAbout(),
      getCapabilities(),
      getExperience(),
      getProjects(),
      getToolbox(),
      getContact(),
      getAllPosts(),
      getFeaturedPosts()
    ]);

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const stats = [
    { label: "engagements", value: String(experience.length).padStart(2, "0") },
    { label: "case files", value: String(projects.length).padStart(2, "0") },
    { label: "notes", value: String(posts.length).padStart(2, "0") },
    { label: "capability lanes", value: String(capabilities.length).padStart(2, "0") }
  ];

  return (
    <>
      <section className="hero-section" id="home">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="hero-status-row">
              <span className="status-pill">{profile.status}</span>
              <span className="status-meta">{profile.availability}</span>
            </div>

            <p className="hero-kicker">00 // entrypoint</p>
            <h1>{profile.name}</h1>
            <p className="hero-alias">{profile.alias}</p>
            <p className="hero-role-line">
              <span className="prompt-marker">&gt;</span> <RotatingRoles roles={profile.roles} />
            </p>
            <p className="hero-summary">{profile.subheadline}</p>

            <div className="hero-actions">
              <Link href="/projects" className="primary-button">
                Open case files
              </Link>
              <a
                href={profile.resumeHref}
                className="ghost-button"
                target="_blank"
                rel="noreferrer"
              >
                Download CV
              </a>
            </div>

            <div className="chip-row hero-focus-row">
              {profile.focusAreas.map((area) => (
                <span key={area} className="chip">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-stack">
            <div className="hero-visual panel">
              <HeroScene />
            </div>

            <div className="hero-panels">
              <div className="operator-card panel">
                <div className="operator-card-header">
                  <span>identity</span>
                  <span>trusted-session</span>
                </div>
                <div className="operator-card-body">
                  <div className="operator-avatar operator-avatar-logo">
                    <Image
                      src={profile.brandLogo}
                      alt={`${profile.alias} logo`}
                      width={240}
                      height={240}
                      priority
                    />
                  </div>
                  <div>
                    <p className="operator-name">{profile.alias}</p>
                    <p className="operator-copy">{profile.name} // {profile.headline}</p>
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="about">
        <div className="shell about-grid">
          <div className="about-art panel">
            <Image src={about.image} alt="Operator portrait" width={620} height={620} unoptimized />
          </div>

          <div className="about-copy">
            <SectionHeading
              eyebrow={about.eyebrow}
              title={about.title}
              lead=""
            />

            <div className="stacked-copy">
              {about.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="principles-grid">
              {about.principles.map((principle) => (
                <div key={principle} className="principle-card panel">
                  {principle}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="capabilities">
        <div className="shell">
          <SectionHeading
            eyebrow="02 // capability-map"
            title="What I do when the target matters."
            lead=""
          />

          <div className="card-grid capability-grid">
            {capabilities.map((capability) => (
              <article key={capability.slug} className="capability-card panel">
                <p className="card-index">/{capability.slug}</p>
                <h3>{capability.title}</h3>
                <p>{capability.summary}</p>
                <ul className="detail-list">
                  {capability.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" id="experience">
        <div className="shell">
          <SectionHeading
            eyebrow="03 // field-history"
            title="Professional experience"
            lead=""
          />

          <div className="timeline">
            {experience.map((entry) => (
              <article key={entry.slug} className="timeline-item panel">
                <div className="timeline-brand">
                  <Image src={entry.logo} alt={entry.company} width={108} height={108} />
                </div>

                <div className="timeline-copy">
                  <div className="timeline-header">
                    <div>
                      <p className="timeline-company">{entry.company}</p>
                      <h3>{entry.role}</h3>
                    </div>
                    <div className="timeline-meta">
                      <span>{entry.period}</span>
                      <span>
                        {entry.mode} // {entry.location}
                      </span>
                    </div>
                  </div>

                  <p>{entry.summary}</p>
                  <ul className="detail-list">
                    {entry.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="chip-row">
                    {entry.tooling.map((tool) => (
                      <span key={tool} className="chip">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" id="projects-preview">
        <div className="shell">
          <SectionHeading
            eyebrow="04 // case-files"
            title="Featured projects and operating concepts"
            lead=""
          />

          <div className="card-grid project-grid">
            {featuredProjects.map((project) => (
              <article key={project.slug} className="project-card panel">
                <div className="project-card-topline">
                  <span className="status-pill">{project.category}</span>
                  <span className="status-meta">{project.status}</span>
                </div>

                <code className="project-command">{project.command}</code>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="chip-row">
                  {project.stack.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
                <Link href={`/projects/${project.slug}`} className="text-link">
                  Open case file
                </Link>
              </article>
            ))}
          </div>

          <div className="section-cta-row">
            <Link href="/projects" className="ghost-button">
              View all projects
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block" id="toolbox">
        <div className="shell">
          <SectionHeading
            eyebrow="05 // operator-stack"
            title="Tooling, workflow, and build surface"
            lead=""
          />

          <div className="card-grid toolbox-grid">
            {toolbox.map((group) => (
              <article key={group.title} className="toolbox-card panel">
                <h3>{group.title}</h3>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" id="blog-preview">
        <div className="shell">
          <SectionHeading
            eyebrow="07 // signal-notes"
            title="Latest writing"
            lead=""
          />

          <div className="card-grid blog-grid">
            {featuredPosts.map((post) => (
              <article key={post.slug} className="blog-card panel">
                <div className="blog-card-meta">
                  <span>{formatDisplayDate(post.date)}</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="chip-row">
                  {post.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`} className="text-link">
                  Read note
                </Link>
              </article>
            ))}
          </div>

          <div className="section-cta-row">
            <Link href="/blog" className="ghost-button">
              Visit the blog
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block" id="contact">
        <div className="shell contact-grid">
          <div>
            <SectionHeading eyebrow={contact.eyebrow} title={contact.title} lead={contact.summary} />
            <div className="contact-side panel">
              <p className="contact-side-label">{contact.responseWindow}</p>
              <ul className="detail-list">
                {contact.channels.map((channel) => (
                  <li key={channel}>{channel}</li>
                ))}
              </ul>

              <div className="social-row">
                {profile.socials.map((social) => (
                  <Link key={social.label} href={social.href} target="_blank" rel="noreferrer">
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <form action={contact.formAction} method="post" className="contact-form panel">
            <div className="form-grid">
              <label>
                <span>Name</span>
                <input required name="name" type="text" placeholder="Omar Ibrahim" />
              </label>
              <label>
                <span>Email</span>
                <input required name="email" type="email" placeholder="operator@company.com" />
              </label>
              <label>
                <span>Company</span>
                <input name="company" type="text" placeholder="Optional" />
              </label>
              <label>
                <span>Subject</span>
                <input required name="subject" type="text" placeholder="Assessment request" />
              </label>
            </div>

            <label>
              <span>Engagement details</span>
              <textarea
                required
                name="message"
                rows={8}
                placeholder="Target type, scope, timeline, current concerns, or anything else that matters."
              />
            </label>

            <button type="submit" className="primary-button">
              Send transmission
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
