const defaultSiteOrigin = "https://omaralmasri.github.io";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const rawSiteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? defaultSiteOrigin;

export const siteBasePath =
  rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");
export const siteOrigin = rawSiteOrigin.replace(/\/$/, "");
export const siteUrl = `${siteOrigin}${siteBasePath}`;

export function toAbsoluteSiteUrl(path = "/") {
  const normalizedPath =
    !path || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}
