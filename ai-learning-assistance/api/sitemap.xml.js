export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://quiz-ai-bo6d.vercel.app/</loc>
    </url>
    <url>
      <loc>https://quiz-ai-bo6d.vercel.app/signup</loc>
    </url>
    <url>
      <loc>https://quiz-ai-bo6d.vercel.app/login</loc>
    </url>
    <url>
      <loc>https://quiz-ai-bo6d.vercel.app/forgot-password</loc>
    </url>
  </urlset>`;

  res.status(200).send(sitemap);
}