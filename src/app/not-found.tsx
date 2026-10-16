import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="section page-section not-found">
      <header className="page-header">
        <p className="eyebrow">404 / PAGE NOT FOUND</p>
        <h1>
          A little <em>off course.</em>
        </h1>
        <p className="page-intro">
          This page couldn’t be found. Let’s get you back to the work.
        </p>
        <Link className="button button-primary" href="/projects">
          Explore Projects
        </Link>
      </header>
    </main>
  );
}
