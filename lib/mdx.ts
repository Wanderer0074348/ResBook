import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ToolFrontmatter,
  WorkflowFrontmatter,
  DotfileFrontmatter,
  ToolContent,
  WorkflowContent,
  DotfileContent,
} from "./types";

const contentDir = path.join(process.cwd(), "content");

export async function getTools(): Promise<ToolContent[]> {
  const toolsDir = path.join(contentDir, "tools");
  const files = await fs.readdir(toolsDir);

  const tools = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(toolsDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const { data, content: body } = matter(content);

        return {
          frontmatter: data as ToolFrontmatter,
          content: body,
        };
      })
  );

  return tools.sort(
    (a, b) => new Date(b.frontmatter.dateAdded).getTime() - new Date(a.frontmatter.dateAdded).getTime()
  );
}

export async function getWorkflows(): Promise<WorkflowContent[]> {
  const workflowsDir = path.join(contentDir, "workflows");
  const files = await fs.readdir(workflowsDir);

  const workflows = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(workflowsDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const { data, content: body } = matter(content);

        return {
          frontmatter: data as WorkflowFrontmatter,
          content: body,
        };
      })
  );

  return workflows.sort(
    (a, b) => new Date(b.frontmatter.dateAdded).getTime() - new Date(a.frontmatter.dateAdded).getTime()
  );
}

export async function getDotfiles(): Promise<DotfileContent[]> {
  const dotfilesDir = path.join(contentDir, "dotfiles");
  const files = await fs.readdir(dotfilesDir);

  const dotfiles = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const filePath = path.join(dotfilesDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const { data, content: body } = matter(content);

        return {
          frontmatter: data as DotfileFrontmatter,
          content: body,
        };
      })
  );

  return dotfiles.sort(
    (a, b) => new Date(b.frontmatter.dateAdded).getTime() - new Date(a.frontmatter.dateAdded).getTime()
  );
}

export async function getToolBySlug(slug: string): Promise<ToolContent | null> {
  try {
    const filePath = path.join(contentDir, "tools", `${slug}.mdx`);
    const content = await fs.readFile(filePath, "utf-8");
    const { data, content: body } = matter(content);

    return {
      frontmatter: data as ToolFrontmatter,
      content: body,
    };
  } catch {
    return null;
  }
}

export async function getWorkflowBySlug(slug: string): Promise<WorkflowContent | null> {
  try {
    const filePath = path.join(contentDir, "workflows", `${slug}.mdx`);
    const content = await fs.readFile(filePath, "utf-8");
    const { data, content: body } = matter(content);

    return {
      frontmatter: data as WorkflowFrontmatter,
      content: body,
    };
  } catch {
    return null;
  }
}

export async function getDotfileBySlug(slug: string): Promise<DotfileContent | null> {
  try {
    const filePath = path.join(contentDir, "dotfiles", `${slug}.mdx`);
    const content = await fs.readFile(filePath, "utf-8");
    const { data, content: body } = matter(content);

    return {
      frontmatter: data as DotfileFrontmatter,
      content: body,
    };
  } catch {
    return null;
  }
}

export async function getAllToolSlugs(): Promise<string[]> {
  try {
    const toolsDir = path.join(contentDir, "tools");
    const files = await fs.readdir(toolsDir);
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(".mdx", ""));
  } catch {
    return [];
  }
}

export async function getAllWorkflowSlugs(): Promise<string[]> {
  try {
    const workflowsDir = path.join(contentDir, "workflows");
    const files = await fs.readdir(workflowsDir);
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(".mdx", ""));
  } catch {
    return [];
  }
}

export async function getAllDotfileSlugs(): Promise<string[]> {
  try {
    const dotfilesDir = path.join(contentDir, "dotfiles");
    const files = await fs.readdir(dotfilesDir);
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(".mdx", ""));
  } catch {
    return [];
  }
}
