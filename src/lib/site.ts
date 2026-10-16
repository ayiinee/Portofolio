// Vercel supplies the production domain. An explicit custom domain takes priority.
export function getSiteOrigin(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelDomain =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const value =
    configured || (vercelDomain ? `https://${vercelDomain}` : undefined);
  if (!value)
    return process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : undefined;
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol))
    throw new Error("Site URL must use HTTP or HTTPS");
  if (process.env.VERCEL && ["localhost", "127.0.0.1"].includes(url.hostname)) {
    throw new Error("A deployed site must use a public site URL");
  }
  return url.origin;
}
