import Image from "next/image";

export function LanyardCard() {
  return (
    <div className="lanyard-stage">
      <div className="lanyard-motion">
        <div className="identity-content">
          <div className="identity-photo">
            <Image
              src="/images/design/aini-lanyard-source.png"
              alt="Qurrotul A’ini wearing a navy hijab and university jacket"
              width={1006}
              height={1326}
              sizes="560px"
              className="identity-photo-source"
            />
          </div>
          <p className="identity-name">Qurrotul A’ini</p>
          <p className="identity-role">Informatics Engineering</p>
          <span className="identity-focus">Cloud · Backend · DevOps</span>
        </div>
        <div className="lanyard-art" aria-hidden="true">
          <Image
            src="/images/design/dusty-blue-lanyard-frame.webp"
            alt=""
            width={1092}
            height={1440}
            sizes="(max-width: 900px) 440px, 560px"
          />
        </div>
      </div>
    </div>
  );
}
