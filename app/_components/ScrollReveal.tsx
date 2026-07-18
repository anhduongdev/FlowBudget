"use client";

import { useEffect } from "react";

/**
 * Thêm hiệu ứng fade-in + trượt lên khi mỗi <section> xuất hiện trong viewport.
 * Tách riêng thành Client Component nhỏ vì IntersectionObserver là browser API
 * — không kéo cả trang thành Client Component chỉ vì hiệu ứng này.
 */
export function ScrollReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      section.classList.add("transition-all", "duration-1000", "opacity-0", "translate-y-10");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        }
      },
      { threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
