import {
  ArrowUpRight,
  Cloud,
  Code2,
  GitBranch,
  FolderOpen,
  FileImage,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { PortraitCard } from "@/components/ui/PortraitCard";
import { TypingGreeting } from "@/components/ui/TypingGreeting";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="hero desk-hero" aria-labelledby="hero-heading">
      <div className="desk-hero-inner">
        <div className="hero-composition">
          <div className="hero-introduction">
            <TypingGreeting name={profile.shortName} />
            <div className="hero-actions">
              <a href="#projects" className="button button-primary">
                View My Work <ArrowUpRight size={16} />
              </a>
              <a href="#contact" className="hero-connect">
                Let’s Connect
              </a>
            </div>
          </div>
          <div
            className="hero-workspace"
            aria-label="A glimpse inside my portfolio"
          >
            <div className="portfolio-folder">
              <div className="folder-stage">
                <div className="folder-back-panel" aria-hidden="true" />
                <div className="folder-photos">
                  {[1, 2].map((number) => (
                    <div
                      className={`photo-memory photo-memory-${number}`}
                      key={number}
                    >
                      <div className="file-title">
                        <FileImage size={12} aria-hidden="true" />
                        <span>moment-0{number}.jpg</span>
                      </div>
                      <div className="photo-slot">
                        <ImageIcon
                          size={28}
                          strokeWidth={1}
                          aria-hidden="true"
                        />
                        <span>Photo coming soon</span>
                      </div>
                      <div className="file-caption">
                        <span>0{number} / Memories</span>
                      </div>
                    </div>
                  ))}
                  <div className="portrait-file">
                    <div className="file-title">
                      <FileImage size={14} aria-hidden="true" />
                      <span>hello-aini.jpg</span>
                      <span className="file-dots" aria-hidden="true">
                        ···
                      </span>
                    </div>
                    <PortraitCard />
                    <div className="file-caption">
                      <span>Qurrotul A’ini</span>
                    </div>
                  </div>
                </div>
                <div className="folder-glass-panel" aria-hidden="true" />
                <Image
                  className="folder-glass-edges"
                  src="/images/design/folder-glass-edges.svg"
                  alt=""
                  width={2384}
                  height={1953}
                  unoptimized
                />
                <div className="folder-front">
                  <div className="folder-title">
                    <FolderOpen
                      size={30}
                      strokeWidth={1.3}
                      aria-hidden="true"
                    />
                    <span>
                      my little
                      <br />
                      <strong>corner of the web.</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <a href="#skills" className="workspace-stack">
              <span>
                <Cloud size={17} />
                Cloud
              </span>
              <span>
                <Code2 size={17} />
                Backend
              </span>
              <span>
                <GitBranch size={17} />
                DevOps
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
