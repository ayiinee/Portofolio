import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { profile } from "@/data/profile";

export function Contact() {
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="section">
        <Reveal>
          <p className="eyebrow">
            <span>06</span>
            <span className="eyebrow-line" />
            CONTACT
          </p>
          <h2 id="contact-heading">
            Let’s build <span>something meaningful.</span>
          </h2>
          <p className="contact-description">
            Whether it’s an interesting engineering challenge, an opportunity to
            collaborate, or a conversation about technology, I’d love to
            connect.
          </p>
          <div className="contact-actions">
            <a
              className="button button-primary"
              href={
                profile.email ? `mailto:${profile.email}` : profile.linkedin
              }
            >
              <Mail size={17} />
              Let’s Talk
            </a>
          </div>
          <div className="social-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={14} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            {profile.email && <a href={`mailto:${profile.email}`}>Email</a>}
          </div>
          <p className="contact-signoff">thanks for stopping by.</p>
        </Reveal>
      </div>
    </section>
  );
}
