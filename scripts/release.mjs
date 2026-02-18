import { execSync } from "node:child_process";

const releaseType = process.argv[2];
const allowedTypes = new Set([
  "major",
  "minor",
  "patch",
  "premajor",
  "preminor",
  "prepatch",
  "prerelease",
]);

if (!releaseType || !allowedTypes.has(releaseType)) {
  throw new Error(
    "Usage: pnpm release -- <major|minor|patch|premajor|preminor|prepatch|prerelease>",
  );
}

execSync(`pnpm version ${releaseType}`, { stdio: "inherit" });
execSync("git push", { stdio: "inherit" });
execSync("git push --follow-tags", { stdio: "inherit" });
execSync("pnpm publish", { stdio: "inherit" });