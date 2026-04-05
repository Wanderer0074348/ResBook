import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

const rootDir = process.cwd();

const toolSchema = {
  required: [
    "title",
    "slug",
    "description",
    "category",
    "pricing",
    "worthIt",
    "dateAdded",
  ],
  enums: {
    category: new Set(["LLM", "Agent", "IDE", "CLI"]),
    pricing: new Set(["Free", "Freemium", "Paid"]),
  },
};

const workflowSchema = {
  required: [
    "title",
    "slug",
    "description",
    "author",
    "complexity",
    "toolsUsed",
    "dateAdded",
  ],
  enums: {
    complexity: new Set(["Beginner", "Intermediate", "Advanced"]),
  },
};

function isValidDate(value) {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime());
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed);
  }
  return false;
}

function assertType(field, value, expectedType, errors, filePath) {
  const valueType = Array.isArray(value) ? "array" : typeof value;
  if (valueType !== expectedType) {
    errors.push(`${filePath}: frontmatter "${field}" must be ${expectedType}, got ${valueType}`);
  }
}

async function getMdxFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => path.join(dirPath, entry.name));
}

function validateSharedFrontmatter(data, schema, filePath, errors) {
  for (const field of schema.required) {
    if (!(field in data)) {
      errors.push(`${filePath}: missing required frontmatter field "${field}"`);
    }
  }

  if ("title" in data) assertType("title", data.title, "string", errors, filePath);
  if ("slug" in data) assertType("slug", data.slug, "string", errors, filePath);
  if ("description" in data) assertType("description", data.description, "string", errors, filePath);
  if ("dateAdded" in data && !isValidDate(data.dateAdded)) {
    errors.push(`${filePath}: frontmatter "dateAdded" must be a valid date string (YYYY-MM-DD)`);
  }

  for (const [field, allowedValues] of Object.entries(schema.enums)) {
    if (field in data && !allowedValues.has(data[field])) {
      errors.push(
        `${filePath}: frontmatter "${field}" must be one of: ${Array.from(allowedValues).join(", "
        )}`
      );
    }
  }
}

function validateToolFrontmatter(data, filePath, errors) {
  validateSharedFrontmatter(data, toolSchema, filePath, errors);
  if ("worthIt" in data) assertType("worthIt", data.worthIt, "boolean", errors, filePath);
}

function validateWorkflowFrontmatter(data, filePath, errors) {
  validateSharedFrontmatter(data, workflowSchema, filePath, errors);

  if ("author" in data) assertType("author", data.author, "string", errors, filePath);

  if ("toolsUsed" in data) {
    const isArray = Array.isArray(data.toolsUsed);
    if (!isArray) {
      errors.push(`${filePath}: frontmatter "toolsUsed" must be an array of tool slugs`);
    } else {
      const nonStringTool = data.toolsUsed.find((toolSlug) => typeof toolSlug !== "string");
      if (nonStringTool !== undefined) {
        errors.push(`${filePath}: frontmatter "toolsUsed" must only contain strings`);
      }
    }
  }
}

function validateFilenameMatchesSlug(filePath, slug, errors) {
  const filenameSlug = path.basename(filePath, ".mdx");
  if (typeof slug === "string" && slug !== filenameSlug) {
    errors.push(
      `${filePath}: frontmatter slug "${slug}" must match filename "${filenameSlug}.mdx"`
    );
  }
}

async function validateDirectory(dirPath, type, seenSlugs, errors) {
  const files = await getMdxFiles(dirPath);

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    if (!content.trim()) {
      errors.push(`${filePath}: content body is empty`);
    }

    if (type === "tools") {
      validateToolFrontmatter(data, filePath, errors);
    } else {
      validateWorkflowFrontmatter(data, filePath, errors);
    }

    validateFilenameMatchesSlug(filePath, data.slug, errors);

    if (typeof data.slug === "string") {
      if (seenSlugs.has(data.slug)) {
        errors.push(`${filePath}: duplicate slug "${data.slug}" in ${type}`);
      } else {
        seenSlugs.add(data.slug);
      }
    }
  }

  return files.length;
}

async function main() {
  const errors = [];
  const toolSlugs = new Set();
  const workflowSlugs = new Set();

  const toolsDir = path.join(rootDir, "content", "tools");
  const workflowsDir = path.join(rootDir, "content", "workflows");

  const [toolCount, workflowCount] = await Promise.all([
    validateDirectory(toolsDir, "tools", toolSlugs, errors),
    validateDirectory(workflowsDir, "workflows", workflowSlugs, errors),
  ]);

  if (errors.length > 0) {
    console.error("\nContent validation failed:\n");
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `Content validation passed (${toolCount} tool files, ${workflowCount} workflow files).`
  );
}

main().catch((error) => {
  console.error("Unexpected error while validating content:", error);
  process.exit(1);
});
