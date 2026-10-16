import { ArrowDownToLine, ArrowUpRight, Mail } from "lucide-react";
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
          <p className="eyebrow justify-center">
            <span>05</span>
            <span className="eyebrow-line" />
            SAY HELLO
          </p>
          <span className="contact-sparkle" aria-hidden="true">
            ✳
          </span>
          <h2 id="contact-heading">
            Good things start
            <br />
            with{" "}
            <span className="font-serif font-normal italic">
              a conversation.
            </span>
          </h2>
          <p className="contact-description">
            An idea to share, a project in mind, or just a friendly hello.
            <br className="hidden sm:block" /> There’s always room for a new
            connection.
          </p>
          <div className="contact-actions">
            {profile.email ? (
              <a
                className="button button-primary"
                href={`mailto:${profile.email}`}
              >
                <Mail size={17} />
                Let’s make something good <ArrowUpRight size={16} />
              </a>
            ) : (
              <p className="contact-pending">
                <span className="status-dot" />
                Contact details coming soon
              </p>
            )}
            {profile.resume && (
              <a
                href={profile.resume}
                className="button button-secondary"
                download
              >
                Download résumé <ArrowDownToLine size={16} />
              </a>
            )}
          </div>
          {(profile.github || profile.linkedin) && (
            <div className="social-links">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <ArrowUpRight size={13} />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          )}
          <p className="contact-signoff">thanks for stopping by.</p>
        </Reveal>
      </div>
    </section>
  );
}
