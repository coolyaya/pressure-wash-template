#!/usr/bin/env node
/**
 * new-client.mjs
 *
 * Client project generator for a Next.js + Tailwind v4 + shadcn/ui template.
 * - Copies template into a new folder
 * - Updates src/content/site.json
 * - Copies default placeholder assets into /public if available
 * - Generates .env.local.example (+ optional .env.local with placeholder values)
 * - Generates CLIENT_NOTES.md
 * - Prints next-steps checklist
 *
 * Requirements:
 * - macOS (zsh) compatible
 * - Node.js ESM
 * - Minimal dependencies (built-in modules only)
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------- Utilities -----------

function color(str, code) {
  return process.stdout.isTTY ? `\u001b[${code}m${str}\u001b[0m` : str;
}
const c = {
  green: (s) => color(s, "32"),
  yellow: (s) => color(s, "33"),
  red: (s) => color(s, "31"),
  cyan: (s) => color(s, "36"),
  dim: (s) => color(s, "2"),
  bold: (s) => color(s, "1"),
};

function safeJsonParse(str, filePath = "JSON") {
  try {
    return JSON.parse(str);
  } catch (e) {
    throw new Error(`Failed to parse ${filePath}: ${e.message}`);
  }
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function titleCase(input) {
  return String(input)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizePhone(input) {
  // Keep digits, plus, parentheses, dashes, spaces.
  const cleaned = String(input).trim().replace(/[^\d+\-() ]/g, "");
  return cleaned;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function isNonEmptyString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

function assertTemplateRepoShape(cwd) {
  // Basic sanity checks so you don’t run this from the wrong folder.
  const required = [
    "package.json",
    "src/content/site.json",
    "src/app",
    "public",
  ];

  const missing = required.filter((p) => !exists(path.join(cwd, p)));
  if (missing.length) {
    throw new Error(
      `This doesn't look like the template repo root.\nMissing: ${missing.join(
        ", "
      )}\nRun this from the template repo root.`
    );
  }
}

const COPY_EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  ".turbo",
  ".vercel",
  "dist",
  "build",
  "coverage",
  ".git",
]);

const COPY_EXCLUDE_FILES = new Set([
  ".DS_Store",
  "package-lock.json",
]);

const ALLOWED_ENV_FILES = new Set([
  ".env.example",
  ".env.local.example",
]);

function shouldExcludeEntry(name, isDir) {
  if (isDir && COPY_EXCLUDE_DIRS.has(name)) return true;
  if (!isDir && COPY_EXCLUDE_FILES.has(name)) return true;

  if (name === ".env.local") return true;
  if (name.startsWith(".env.") && !ALLOWED_ENV_FILES.has(name)) return true;

  return false;
}

// Copy directory recursively, excluding some common junk.
function copyDirRecursive(src, dest) {

  const srcStat = fs.statSync(src);
  if (!srcStat.isDirectory()) {
    throw new Error(`Source is not a directory: ${src}`);
  }

  ensureDir(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const name = entry.name;
    if (shouldExcludeEntry(name, entry.isDirectory())) continue;

    const srcPath = path.join(src, name);
    const destPath = path.join(dest, name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      // Avoid weird symlink copying issues; copy as-is target path string.
      const linkTarget = fs.readlinkSync(srcPath);
      fs.symlinkSync(linkTarget, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writeFileSafe(filePath, content, { overwrite = false } = {}) {
  if (!overwrite && exists(filePath)) {
    throw new Error(`Refusing to overwrite existing file: ${filePath}`);
  }
  fs.writeFileSync(filePath, content, "utf8");
}

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return safeJsonParse(raw, filePath);
}

function writeJsonFile(filePath, obj) {
  const content = JSON.stringify(obj, null, 2) + "\n";
  fs.writeFileSync(filePath, content, "utf8");
}

function tryGitInit(repoDir) {
  try {
    execSync("git init", { cwd: repoDir, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function shortBrandName(businessName) {
  // Attempts a “logoText” friendly short version:
  // - Remove common suffixes: LLC, Inc, Co, Company, Services
  // - Keep <= 18 chars if possible
  const cleaned = String(businessName)
    .replace(/\b(llc|inc|co|company|services|service)\b\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= 18) return cleaned;

  // Try first 2 words
  const parts = cleaned.split(" ").filter(Boolean);
  const firstTwo = parts.slice(0, 2).join(" ");
  if (firstTwo.length <= 18) return firstTwo;

  // Fall back to first word truncated
  return parts[0].slice(0, 18);
}

function buildDefaultSeoDescription({ cityState }) {
  return `Licensed & insured pressure washing in ${cityState}. Driveways, sidewalks, house washing (soft wash), patios, and fences. Fast quotes and reliable scheduling.`;
}

function parseCommaList(input) {
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLinesList(input) {
  return String(input)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseAreas(input) {
  const raw = String(input)
    .split("\n")
    .flatMap((line) => line.split(","))
    .map((s) => s.trim())
    .filter(Boolean);

  const normalized = raw.map(titleCase);

  const deduped = [];
  const seen = new Set();
  for (const a of normalized) {
    const key = a.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(a);
    }
  }
  return deduped;
}

function formatServiceListForJson(services) {
  // Your site.json schema may want {title, description} objects or plain strings.
  // This function tries to preserve existing schema: if template has objects, use objects.
  return services;
}

// ----------- Prompting -----------

function createPrompter() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q) =>
    new Promise((resolve) => rl.question(q, (ans) => resolve(ans)));

  const close = () => rl.close();

  return { ask, close };
}

async function promptNonEmpty({ ask }, label, { defaultValue } = {}) {
  while (true) {
    const suffix = defaultValue ? c.dim(` (default: ${defaultValue})`) : "";
    const ans = (await ask(`${label}${suffix}: `)).trim();
    if (!ans && defaultValue) return defaultValue;
    if (ans) return ans;
    console.log(c.red("Required. Please enter a value."));
  }
}

async function promptYesNo({ ask }, label, { defaultValue = false } = {}) {
  const def = defaultValue ? "Y/n" : "y/N";
  while (true) {
    const ans = (await ask(`${label} (${def}): `)).trim().toLowerCase();
    if (!ans) return defaultValue;
    if (["y", "yes"].includes(ans)) return true;
    if (["n", "no"].includes(ans)) return false;
    console.log(c.red("Please enter y or n."));
  }
}

async function promptChoice({ ask }, label, choices, { defaultValue } = {}) {
  const normalizedChoices = choices.map(String);
  const menu = normalizedChoices
    .map((v, i) => `  ${i + 1}) ${v}`)
    .join("\n");
  console.log(`${label}\n${menu}`);

  while (true) {
    const suffix = defaultValue ? c.dim(` (default: ${defaultValue})`) : "";
    const ans = (await ask(`Choose 1-${choices.length}${suffix}: `)).trim();
    if (!ans && defaultValue) return defaultValue;

    const n = Number(ans);
    if (!Number.isNaN(n) && n >= 1 && n <= choices.length) {
      return normalizedChoices[n - 1];
    }

    // allow direct typing
    const direct = normalizedChoices.find(
      (c0) => c0.toLowerCase() === ans.toLowerCase()
    );
    if (direct) return direct;

    console.log(c.red("Invalid choice. Try again."));
  }
}

async function promptMultiLine({ ask }, label, { hint } = {}) {
  console.log(`${label}`);
  if (hint) console.log(c.dim(hint));
  console.log(c.dim("Finish by entering a single '.' on its own line.\n"));

  const lines = [];
  while (true) {
    const line = await ask("> ");
    if (line.trim() === ".") break;
    lines.push(line);
  }
  return lines.join("\n").trim();
}

// ----------- Theme presets -----------

const THEME_PRESETS = {
  Blue: {
    name: "Blue",
    brand: {
      primary: "217.2 91.2% 59.8%",
      primaryForeground: "210 40% 98%",
      accent: "217.2 91.2% 59.8%",
      accentForeground: "222.2 47.4% 11.2%",
    },
    radius: "2rem",
  },
  Green: {
    name: "Green",
    brand: {
      primary: "142.1 76.2% 36.3%",
      primaryForeground: "210 40% 98%",
      accent: "142.1 76.2% 36.3%",
      accentForeground: "222.2 47.4% 11.2%",
    },
    radius: "2rem",
  },
  Orange: {
    name: "Orange",
    brand: {
      primary: "24.6 95% 53.1%",
      primaryForeground: "210 40% 98%",
      accent: "24.6 95% 53.1%",
      accentForeground: "222.2 47.4% 11.2%",
    },
    radius: "2rem",
  },
  Slate: {
    name: "Slate",
    brand: {
      primary: "215.4 16.3% 46.9%",
      primaryForeground: "210 40% 98%",
      accent: "215.4 16.3% 46.9%",
      accentForeground: "222.2 47.4% 11.2%",
    },
    radius: "2rem",
  },
};


// ----------- Defaults -----------

const DEFAULT_PRESSURE_WASHING_SERVICES = [
  "House Washing",
  "Driveway Cleaning",
  "Sidewalk & Walkway Cleaning",
  "Deck & Patio Washing",
  "Fence Washing",
  "Gutter Brightening",
  "Commercial Pressure Washing",
  "Soft Washing",
];

const DEFAULT_SERVICE_AREAS_HINT =
  "Examples: Downtown, West Side, Springfield, 20mi radius, etc.";

const DEFAULT_TEMPLATE_ASSETS_DIR = path.join(
  __dirname,
  "new-client-assets"
);

// If you create scripts/new-client-assets/hero.jpg etc, the script will copy them.
// If not present, it will leave whatever template has in /public.

const PLACEHOLDER_PUBLIC_FILES = [
  { src: "hero.jpg", dest: "hero.jpg" },
  { src: "favicon.ico", dest: "favicon.ico" },
  { src: "og.jpg", dest: "og.jpg" },
];

// ----------- Client Notes Template -----------

function buildClientNotesMd(data) {
  const {
    businessName,
    slug,
    cityState,
    phone,
    publicEmail,
    leadToEmail,
    domain,
    layout,
    theme,
    services,
    serviceAreas,
  } = data;

  const siteUrl = domain ? `https://${domain}` : "(not set yet)";

  return `# CLIENT_NOTES — ${businessName}

## Project
- Client slug: \`${slug}\`
- Business name: ${businessName}
- Location: ${cityState}
- Domain: ${domain || "(TBD)"}  
- Target URL: ${siteUrl}
- Layout variant: ${layout}
- Theme preset: ${theme}

## Contact
- Phone: ${phone}
- Public email (on site): ${publicEmail}
- Lead recipient email (env): ${leadToEmail}

## Services
${services.map((s) => `- ${s}`).join("\n")}

## Service Areas
${serviceAreas.map((a) => `- ${a}`).join("\n")}

## Assets
- Hero image: /public/hero.jpg
- Favicon: /public/favicon.ico
- OG image (optional): /public/og.jpg

## Content checklist
- [ ] Confirm business tagline
- [ ] Confirm service list + ordering
- [ ] Confirm service areas (cities / neighborhoods / radius)
- [ ] Confirm reviews (if any)
- [ ] Confirm about section (licensed/insured, years in business, team size)
- [ ] Confirm FAQ
- [ ] Confirm contact form redirect URL (default: /thanks)
- [ ] Confirm SEO title/description and domain in siteUrl

## Deployment checklist (Vercel)
- [ ] Create GitHub repo: \`${slug}\`
- [ ] Push generated project to repo
- [ ] Import to Vercel
- [ ] Set environment variables:
  - RESEND_API_KEY
  - LEAD_TO_EMAIL=${leadToEmail}
  - LEAD_FROM_EMAIL=leads@${domain || "yourdomain.com"} (replace)
- [ ] Set Vercel domain + DNS
- [ ] Verify /sitemap.xml and /robots.txt
- [ ] Send test lead form submission
`;
}

// ----------- Main -----------

async function main() {
  const cwd = process.cwd();
  assertTemplateRepoShape(cwd);

  const { ask, close } = createPrompter();

  console.log(c.bold("\nNew Client Project Generator\n"));
  console.log(c.dim("Template repo:"), cwd);
  console.log("");

  // Where to generate?
  const defaultOutsideDir = path.resolve(cwd, "..", "clients");
  const insideDir = path.join(cwd, "clients");

  const locationChoice = await promptChoice(
    { ask },
    "Where should the new client project be created?",
    [
      `Outside template repo (recommended): ${defaultOutsideDir}`,
      `Inside template repo: ${insideDir}`,
      `Custom path...`,
    ],
    { defaultValue: `Outside template repo (recommended): ${defaultOutsideDir}` }
  );

  let baseOutputDir = defaultOutsideDir;
  if (locationChoice.startsWith("Inside")) baseOutputDir = insideDir;
  if (locationChoice.startsWith("Custom")) {
    const custom = await promptNonEmpty({ ask }, "Enter absolute or relative path");
    baseOutputDir = path.resolve(cwd, custom);
  }

  // Prompts
  const businessName = await promptNonEmpty({ ask }, "Business Name");
  const city = await promptNonEmpty({ ask }, "City");
  const state = await promptNonEmpty({ ask }, "State (2-letter preferred)", {
    defaultValue: "",
  });

  const cityState = `${titleCase(city)}, ${state.toUpperCase()}`.trim();

  const phone = normalizePhone(await promptNonEmpty({ ask }, "Phone"));
  const publicEmail = await promptNonEmpty({ ask }, "Public Contact Email (shows on site)");
  const leadToEmail = await promptNonEmpty({ ask }, "Lead Recipient Email (LEAD_TO_EMAIL env var)");

  const domainRaw = (await ask("Domain (optional, e.g. example.com): ")).trim();
  const domain = domainRaw ? domainRaw.replace(/^https?:\/\//, "").replace(/\/+$/, "") : "";

  const layout = await promptChoice({ ask }, "Choose layout variant", ["A", "B", "C"], {
    defaultValue: "A",
  });

  const theme = await promptChoice(
    { ask },
    "Choose theme preset",
    ["Blue", "Green", "Orange", "Slate"],
    { defaultValue: "Blue" }
  );

  // Services
  const servicesMode = await promptChoice(
    { ask },
    "Services input mode",
    ["Use default pressure washing services", "Paste services (one per line)"],
    { defaultValue: "Use default pressure washing services" }
  );

  let services = [];
  if (servicesMode.startsWith("Use default")) {
    services = [...DEFAULT_PRESSURE_WASHING_SERVICES];
  } else {
    const pasted = await promptMultiLine(
      { ask },
      "Paste services (one per line)",
      { hint: "Example:\nHouse Washing\nDriveway Cleaning\nFence Washing" }
    );
    services = parseLinesList(pasted);
    if (!services.length) services = [...DEFAULT_PRESSURE_WASHING_SERVICES];
  }

  // Service Areas
  const serviceAreasPasted = await promptMultiLine(
    { ask },
    "Paste service areas (one per line)",
    { hint: DEFAULT_SERVICE_AREAS_HINT }
  );
  let serviceAreas = parseAreas(serviceAreasPasted);
  if (!serviceAreas.length) {
    // Minimum fallback: the city itself
    serviceAreas = [titleCase(city)];
  }

  // Slug / project name
  const defaultSlug = slugify(businessName || "client");
  let slug = defaultSlug;
  while (true) {
    console.log(c.dim(`Proposed slug: ${slug}`));
    const entered = (await ask(`Slug (press Enter to keep "${slug}"): `)).trim();
    const candidate = slugify(entered || slug);

    if (!candidate) {
      console.log(c.red("Slug cannot be empty."));
      continue;
    }

    const ok = await promptYesNo(
      { ask },
      `Confirm slug "${candidate}"?`,
      { defaultValue: true }
    );
    if (ok) {
      slug = candidate;
      break;
    }
    slug = candidate;
  }

  const outputDir = path.join(baseOutputDir, slug);

  // Safety: confirm overwrite
  if (exists(outputDir)) {
    console.log(c.red(`\nTarget folder already exists: ${outputDir}`));
    const ok = await promptYesNo({ ask }, "Do you want to overwrite it? This will DELETE the folder.", {
      defaultValue: false,
    });
    if (!ok) {
      close();
      console.log(c.yellow("Aborted."));
      process.exit(0);
    }

    // Delete directory
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  // Confirm creation
  console.log("\nSummary:");
  console.log(`- Business: ${businessName}`);
  console.log(`- Location: ${cityState}`);
  console.log(`- Slug: ${slug}`);
  console.log(`- Output: ${outputDir}`);
  console.log(`- Layout: ${layout}`);
  console.log(`- Theme: ${theme}`);
  console.log(`- Domain: ${domain || "(none)"}`);

  const proceed = await promptYesNo({ ask }, "\nProceed?", { defaultValue: true });
  if (!proceed) {
    close();
    console.log(c.yellow("Aborted."));
    process.exit(0);
  }

  // Copy template repo into output dir
  console.log(c.cyan("\nCopying template..."));
  ensureDir(baseOutputDir);
  copyDirRecursive(cwd, outputDir);

  // Update package.json
  console.log(c.cyan("Updating package.json..."));
  const packageJsonPath = path.join(outputDir, "package.json");
  if (!exists(packageJsonPath)) {
    close();
    throw new Error(`Missing package.json in generated project: ${packageJsonPath}`);
  }
  const packageJson = readJsonFile(packageJsonPath);
  packageJson.name = slug;
  packageJson.private = true;
  writeJsonFile(packageJsonPath, packageJson);

  // Update site.json
  console.log(c.cyan("Updating src/content/site.json..."));
  const siteJsonPath = path.join(outputDir, "src/content/site.json");
  if (!exists(siteJsonPath)) {
    close();
    throw new Error(`Missing site.json in generated project: ${siteJsonPath}`);
  }

  const site = readJsonFile(siteJsonPath);

  // Apply updates (defensive: only touch fields that exist, but also set if missing)
  site.businessName = businessName;
  if (site.footer?.copyright) {
    site.footer.copyright = `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`;
  }
  site.tagline = site.tagline || "Professional exterior cleaning you can count on.";
  site.phone = phone;
  site.email = publicEmail;
  site.city = cityState;
  site.serviceAreas = serviceAreas;

  site.layout = layout;

  site.assets = site.assets || {};
  site.assets.heroImage = site.assets.heroImage || "/hero.jpg";

  site.assets.logoText = shortBrandName(businessName);

  // Update SEO
  site.seo = site.seo || {};
  site.seo.siteUrl = domain ? `https://${domain}` : site.seo.siteUrl || "";
  site.seo.defaultTitle = `${businessName} | ${cityState}`;
  site.seo.defaultDescription = buildDefaultSeoDescription({ cityState });

  // Theme preset integration
  site.theme = site.theme || {};
  site.theme.brand = site.theme.brand || {};

  const preset = THEME_PRESETS[theme];
  site.theme.brand = { ...site.theme.brand, ...preset.brand };
  site.theme.radius = preset.radius;

  site.services = services.map((title) => ({
    title,
    desc: `Professional ${title.toLowerCase()} in ${cityState}.`,
  }));

  writeJsonFile(siteJsonPath, site);

  // Copy placeholder assets if available
  console.log(c.cyan("Setting public assets..."));
  const publicDir = path.join(outputDir, "public");

  for (const f of PLACEHOLDER_PUBLIC_FILES) {
    const src = path.join(DEFAULT_TEMPLATE_ASSETS_DIR, f.src);
    const dest = path.join(publicDir, f.dest);

    if (exists(src)) {
      fs.copyFileSync(src, dest);
    } else {
      // If no placeholder exists, leave as-is.
      // But if dest doesn't exist either, warn the user.
      if (!exists(dest)) {
        console.log(
          c.yellow(
            `  - Missing placeholder '${f.src}' and no existing '${f.dest}' in /public. Add it manually.`
          )
        );
      }
    }
  }

  // .env.local.example
  console.log(c.cyan("Creating .env.local.example..."));
  const envExamplePath = path.join(outputDir, ".env.local.example");
  const envExample = `# Do NOT commit .env.local
# Copy this file to .env.local and fill in real values.

RESEND_API_KEY="YOUR_RESEND_API_KEY"
LEAD_TO_EMAIL="${leadToEmail}"
LEAD_FROM_EMAIL="leads@${domain || "yourdomain.com"}"
`;
  writeFileSafe(envExamplePath, envExample, { overwrite: true });

  const createEnvLocal = await promptYesNo(
    { ask },
    "Also create a .env.local file with placeholder values?",
    { defaultValue: false }
  );

  if (createEnvLocal) {
    const envLocalPath = path.join(outputDir, ".env.local");
    if (exists(envLocalPath)) {
      const ok = await promptYesNo(
        { ask },
        ".env.local already exists. Overwrite?",
        { defaultValue: false }
      );
      if (ok) writeFileSafe(envLocalPath, envExample, { overwrite: true });
    } else {
      writeFileSafe(envLocalPath, envExample, { overwrite: false });
    }
  }

  // Client notes
  const createClientNotes = await promptYesNo(
    { ask },
    "Generate CLIENT_NOTES.md?",
    { defaultValue: true }
  );

  if (createClientNotes) {
    console.log(c.cyan("Creating CLIENT_NOTES.md..."));
    const notesPath = path.join(outputDir, "CLIENT_NOTES.md");
    const notes = buildClientNotesMd({
      businessName,
      slug,
      cityState,
      phone,
      publicEmail,
      leadToEmail,
      domain,
      layout,
      theme,
      services,
      serviceAreas,
    });
    writeFileSafe(notesPath, notes, { overwrite: true });
  }

  // Optional git init
  const initGit = await promptYesNo({ ask }, "Initialize a new git repo in the client folder?", {
    defaultValue: true,
  });

  if (initGit) {
    console.log(c.cyan("Initializing git repo..."));
    const ok = tryGitInit(outputDir);
    if (!ok) console.log(c.yellow("  - git init failed (is git installed?)"));
  }

  close();

  const junkPaths = [
    path.join(outputDir, ".next"),
    path.join(outputDir, "node_modules"),
  ].filter(exists);

  if (junkPaths.length) {
    const relJunk = junkPaths.map((p) => path.relative(outputDir, p));
    console.log(
      c.yellow(
        `\nWarning: unexpected build artifacts found in generated project: ${relJunk.join(
          ", "
        )}`
      )
    );
    console.log(
      c.yellow(
        `Suggested cleanup: rm -rf ${relJunk.map((p) => `"${p}"`).join(" ")}`
      )
    );
  }

  // Final next steps checklist
  console.log(c.green("\n✅ Client project generated successfully.\n"));
  console.log(c.bold("Next steps:"));
  console.log(`1) cd ${outputDir}`);
  console.log("2) npm install");
  console.log("3) npm run dev");
  console.log("4) Review and adjust content:");
  console.log("   - src/content/site.json");
  console.log("   - public/hero.jpg, public/favicon.ico, public/og.jpg");
  console.log("5) Create a new GitHub repo and push:");
  console.log(`   - repo name: ${slug}`);
  console.log("6) Import into Vercel:");
  console.log("   - set env vars: RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL");
  console.log("7) Set domain + DNS");
  console.log("8) Test:");
  console.log("   - /sitemap.xml");
  console.log("   - /robots.txt");
  console.log("   - lead form submission\n");

  console.log(c.dim("Generated at: ") + outputDir);
}

main().catch((err) => {
  console.error(c.red("\nERROR:\n") + err.message);
  process.exit(1);
});
