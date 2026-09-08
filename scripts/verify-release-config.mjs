// Validates the semantic-release setup and previews the next release.
//
// semantic-release itself refuses to do anything on a pull_request event (it
// returns early, which is why the old "Dry Release" job passed unconditionally
// without ever checking a thing). So instead of shelling out to it, this script
// loads .releaserc, resolves every configured plugin, and runs the real
// commit-analyzer over the commits since the last tag to report the version
// that a merge to master would publish.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { appendFileSync } from "node:fs";

const STEPS = [
  "verifyConditions",
  "analyzeCommits",
  "verifyRelease",
  "generateNotes",
  "addChannel",
  "prepare",
  "publish",
  "success",
  "fail",
];

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const config = JSON.parse(readFileSync(".releaserc", "utf8"));
const plugins = config.plugins.map((entry) =>
  Array.isArray(entry) ? entry : [entry, {}]
);

console.log("Resolving plugins from .releaserc");
const failures = [];
for (const [name] of plugins) {
  try {
    const mod = await import(name);
    const steps = STEPS.filter((step) => typeof mod[step] === "function");
    if (steps.length === 0) {
      failures.push(`${name} exposes no semantic-release lifecycle step`);
      continue;
    }
    console.log(`  ok  ${name} (${steps.join(", ")})`);
  } catch (error) {
    failures.push(`${name} failed to load: ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error("\nRelease configuration is broken:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

// Work out what the next release would be.
let lastTag = null;
try {
  lastTag = git("describe", "--tags", "--abbrev=0");
} catch {
  console.log("\nNo tags found; treating every commit as new.");
}

const range = lastTag ? `${lastTag}..HEAD` : "HEAD";
const commits = git("log", range, "--format=%H%x00%B%x1e")
  .split("\x1e")
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [hash, message] = entry.split("\x00");
    return { hash, message: message.trim() };
  });

const [, analyzerConfig = {}] =
  plugins.find(([name]) => name === "@semantic-release/commit-analyzer") ?? [];

const { analyzeCommits } = await import("@semantic-release/commit-analyzer");
const releaseType = await analyzeCommits(analyzerConfig, {
  commits,
  cwd: process.cwd(),
  logger: { log: () => {} },
});

const bump = (version, type) => {
  const [major, minor, patch] = version
    .replace(/^v/, "")
    .split(".")
    .map(Number);
  if (type === "major") return `${major + 1}.0.0`;
  if (type === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

const current = lastTag ?? "v0.0.0";
const summary = releaseType
  ? `**${current} → v${bump(current, releaseType)}** (\`${releaseType}\` release, from ${commits.length} commit(s))`
  : `**No release.** None of the ${commits.length} commit(s) since ${current} match a release rule.`;

console.log(`\n${summary.replace(/\*\*/g, "")}`);
for (const commit of commits) {
  console.log(`  ${commit.hash.slice(0, 7)} ${commit.message.split("\n")[0]}`);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = [
    "### Release preview",
    "",
    summary,
    "",
    ...commits.map(
      (c) => `- \`${c.hash.slice(0, 7)}\` ${c.message.split("\n")[0]}`
    ),
  ];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
}
