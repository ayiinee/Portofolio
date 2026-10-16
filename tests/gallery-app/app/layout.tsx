import "../../../src/app/globals.css";

export const metadata = { title: "Portfolio gallery QA fixtures" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
