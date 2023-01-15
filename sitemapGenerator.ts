// @ts-ignore
const sitemap = require("nextjs-sitemap-generator");
sitemap({
  baseUrl: process.env.NEXT_PUBLIC_CLIENT_URL || "",
  ignoredPaths: ["submissions"],
  pagesDirectory: __dirname + "\\.vercel/output/static/",
  targetDirectory: __dirname + "\\.vercel/output/static/",
  sitemapFilename: "sitemap.xml",
  allowFileExtensions: true,
  nextConfigPath: __dirname + "\\next.config.js",
});
