import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main id="main-content" className="section page-section not-found">
      <header className="page-header">
        <p className="eyebrow">404 / PROJECT NOT FOUND</p>
        <h1>
          A page still <em>unwritten.</em>
        </h1>
        <p className="page-intro">
          That project isn’t part of this collection. There’s more work to
          explore below.
        </p>
        <Link className="button button-primary" href="/projects">
          Back to Projects
        </Link>
      </header>
    </main>
  );
}
