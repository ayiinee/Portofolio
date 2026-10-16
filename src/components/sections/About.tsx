import { ArrowDownRight, Heart, Lightbulb, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section
      id="about"
      className="section about-section"
      aria-labelledby="about-heading"
    >
      <Reveal>
        <SectionHeading
          number="01"
          label="A LITTLE INTRODUCTION"
          title="More than"
          accent="a name on a screen."
          id="about-heading"
        />
      </Reveal>
      <div className="about-grid">
        <Reveal className="about-copy">
          <p className="intro-text">
            I’m {profile.name},<br />
            an informatics student with a curious mind
            <span className="text-blue">.</span>
          </p>
          <p>
            This is a growing collection of things I’m making, questions I’m
            exploring, and ideas I’m bringing to life. A space to document my
            learning and connect the dots between design and technology.
          </p>
          <p>
            There’s a lot more of my story to come. For now, have a look
            around—and follow along as this space grows.
          </p>
          <span className="signature">a little curiosity goes a long way.</span>
          <ArrowDownRight
            className="about-arrow"
            size={43}
            strokeWidth={1}
            aria-hidden="true"
          />
        </Reveal>
        <Reveal delay={0.12} className="about-note">
          <span className="note-pin" aria-hidden="true" />
          <span className="eyebrow">A FEW THINGS I COME BACK TO</span>
          <ul>
            <li>
              <Lightbulb size={20} strokeWidth={1.4} />
              <span>
                Stay curious.<small>Good things start with a question.</small>
              </span>
            </li>
            <li>
              <Heart size={20} strokeWidth={1.4} />
              <span>
                Make it thoughtful.
                <small>The small details make the difference.</small>
              </span>
            </li>
            <li>
              <Sparkles size={20} strokeWidth={1.4} />
              <span>
                Keep creating.
                <small>There’s always something new to learn.</small>
              </span>
            </li>
          </ul>
          <span className="note-signature">a note to myself ↗</span>
        </Reveal>
      </div>
    </section>
  );
}
