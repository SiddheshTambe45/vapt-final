export async function GET() {
  const GITHUB_APP_INSTALL_URL =
    "https://github.com/apps/vapt-automation/installations/new";

  return new Response(null, {
    status: 302, // Redirect response
    headers: {
      Location: GITHUB_APP_INSTALL_URL,
    },
  });
}
