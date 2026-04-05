"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Get all headings from the article
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = Array.from(article.querySelectorAll("h2, h3")).map(
      (element, index) => {
        // Set ID if not present
        if (!element.id) {
          element.id = `heading-${index}`;
        }
        return {
          id: element.id,
          text: element.textContent || "",
          level: parseInt(element.tagName[1]),
        };
      }
    );
    const rafId = window.requestAnimationFrame(() => {
      setHeadings(headingElements);
    });

    // Observe active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headingElements.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="hidden xl:block fixed right-8 top-32 w-48">
      <div className="text-xs font-bold mb-4 uppercase tracking-wide">On this page</div>
      <nav className="space-y-2 text-sm">
        {headings.map((heading) => (
          <Link
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "block transition-colors",
              "hover:text-black dark:hover:text-white",
              activeId === heading.id
                ? "text-black font-bold dark:text-white"
                : "text-gray-600 dark:text-gray-400",
              heading.level === 3 && "ml-4"
            )}
          >
            {heading.text}
          </Link>
        ))}
      </nav>
    </div>
  );
}
