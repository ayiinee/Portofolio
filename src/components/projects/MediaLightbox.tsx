"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import type { ProjectMedia } from "@/types/project";
import styles from "./MediaLightbox.module.css";

export function mediaCaption(media: ProjectMedia) {
  const attribution =
    media.provenance === "competition-provided"
      ? "Competition-provided architecture reference."
      : media.provenance === "reconstructed"
        ? "Reconstructed later for explanation."
        : "";
  return [media.caption, attribution].filter(Boolean).join(" ");
}

export default function MediaLightbox({
  media,
  index,
  open,
  close,
  exited,
}: {
  media: ProjectMedia[];
  index: number;
  open: boolean;
  close: () => void;
  exited: () => void;
}) {
  return (
    <Lightbox
      className={styles.viewer}
      open={open}
      close={close}
      index={index}
      slides={media.map((item) => ({
        src: item.src,
        alt: item.alt,
        width: item.width,
        height: item.height,
        description: mediaCaption(item),
      }))}
      plugins={[Captions]}
      carousel={{ finite: true }}
      controller={{ closeOnBackdropClick: true }}
      on={{ exited }}
    />
  );
}
