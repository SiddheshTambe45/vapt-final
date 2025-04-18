/**
 * Filters discovered URLs to return meaningful paths for active scanning.
 * Ignores static assets like JS chunks, CSS, images, etc.
 */
function getAttackPathsFromUrls(urls, baseHost) {
  const paths = new Set();

  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes(baseHost)) continue;

      const pathname = parsed.pathname;

      // Ignore static asset paths
      const ignorePatterns = [
        /^\/_next\/static/,
        /\.js$/,
        /\.css$/,
        /\.ico$/,
        /\.png$/,
        /\.jpg$/,
        /\.jpeg$/,
        /\.svg$/,
        /^\/favicon\.ico/,
      ];

      if (!ignorePatterns.some((regex) => regex.test(pathname))) {
        // Only include meaningful API/pages (no query strings)
        paths.add(pathname);
      }
    } catch (err) {
      console.warn("❌ Error parsing URL:", url, err);
    }
  }

  return Array.from(paths);
}
