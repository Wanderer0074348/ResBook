"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Code, Terminal, Check, Copy } from "lucide-react";

interface StackItem {
  type: "tool" | "workflow" | "dotfile";
  slug: string;
  title: string;
}

export function PersonalStackBuilder() {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [exportFormat, setExportFormat] = useState<"markdown" | "json" | "shell">("markdown");
  const [exportedContent, setExportedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("resbook-personal-stack");
    if (stored) {
      try {
        setStack(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    const handleStackUpdate = () => {
      const stored = localStorage.getItem("resbook-personal-stack");
      if (stored) {
        try {
          setStack(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("resbook:stack-updated", handleStackUpdate);
    return () => window.removeEventListener("resbook:stack-updated", handleStackUpdate);
  }, []);

  const saveStack = (newStack: StackItem[]) => {
    setStack(newStack);
    localStorage.setItem("resbook-personal-stack", JSON.stringify(newStack));
  };

  const generateMarkdown = () => {
    const tools = stack.filter((s) => s.type === "tool");
    const workflows = stack.filter((s) => s.type === "workflow");
    const dotfiles = stack.filter((s) => s.type === "dotfile");

    let md = "# My AI Stack\n\n";
    md += `*Generated from ResBook on ${new Date().toLocaleDateString()}*\n\n`;

    if (tools.length > 0) {
      md += "## Tools\n\n";
      tools.forEach((t) => {
        md += `- [${t.title}](/tools/${t.slug})\n`;
      });
      md += "\n";
    }

    if (workflows.length > 0) {
      md += "## Workflows\n\n";
      workflows.forEach((w) => {
        md += `- [${w.title}](/workflows/${w.slug})\n`;
      });
      md += "\n";
    }

    if (dotfiles.length > 0) {
      md += "## Dotfiles\n\n";
      dotfiles.forEach((d) => {
        md += `- [${d.title}](/dotfiles/${d.slug})\n`;
      });
      md += "\n";
    }

    return md;
  };

  const generateJSON = () => {
    const data = {
      generated: new Date().toISOString(),
      stack: {
        tools: stack.filter((s) => s.type === "tool").map((s) => s.slug),
        workflows: stack.filter((s) => s.type === "workflow").map((s) => s.slug),
        dotfiles: stack.filter((s) => s.type === "dotfile").map((s) => s.slug),
      },
    };
    return JSON.stringify(data, null, 2);
  };

  const generateShell = () => {
    const tools = stack.filter((s) => s.type === "tool");
    let sh = "#!/bin/bash\n";
    sh += "# My AI Stack - Installation Script\n\n";
    sh += "# Generated from ResBook\n\n";

    tools.forEach((t) => {
      sh += `# Install ${t.title}\n`;
      sh += `# See: https://resbook.vercel.app/tools/${t.slug}\n`;
      sh += "# brew install " + t.slug + "\n\n";
    });

    return sh;
  };

  const handleExport = () => {
    let content = "";
    switch (exportFormat) {
      case "markdown":
        content = generateMarkdown();
        break;
      case "json":
        content = generateJSON();
        break;
      case "shell":
        content = generateShell();
        break;
    }
    setExportedContent(content);
  };

  const handleCopy = async () => {
    if (!exportedContent) return;
    await navigator.clipboard.writeText(exportedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!exportedContent) return;

    const extensions: Record<string, string> = {
      markdown: "md",
      json: "json",
      shell: "sh",
    };

    const blob = new Blob([exportedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-ai-stack.${extensions[exportFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearStack = () => {
    saveStack([]);
    setExportedContent(null);
  };

  if (!isClient) return null;

  return (
    <div className="border border-gray-300 dark:border-gray-700">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <h3 className="font-bold text-lg">My Stack</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {stack.length} items saved
        </p>
      </div>

      {stack.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm">
          No items in your stack yet. Browse tools, workflows, and dotfiles to add them.
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={`${item.type}-${item.slug}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs"
                >
                  {item.type === "tool" && "🔧"}
                  {item.type === "workflow" && "⚡"}
                  {item.type === "dotfile" && "📁"}
                  {item.title}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => {
                  setExportFormat("markdown");
                  setExportedContent(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm border ${
                  exportFormat === "markdown"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                Markdown
              </button>
              <button
                onClick={() => {
                  setExportFormat("json");
                  setExportedContent(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm border ${
                  exportFormat === "json"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <Code className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={() => {
                  setExportFormat("shell");
                  setExportedContent(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm border ${
                  exportFormat === "shell"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <Terminal className="w-4 h-4" />
                Shell
              </button>
            </div>

            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90"
            >
              <Download className="w-4 h-4" />
              Generate {exportFormat === "markdown" ? "README" : exportFormat.toUpperCase()}
            </button>

            {exportedContent && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Preview</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
                <pre className="p-3 bg-gray-100 dark:bg-gray-900 text-xs overflow-x-auto max-h-48">
                  {exportedContent}
                </pre>
              </div>
            )}

            <button
              onClick={clearStack}
              className="mt-4 w-full text-xs text-gray-500 hover:text-red-600"
            >
              Clear stack
            </button>
          </div>
        </>
      )}
    </div>
  );
}
