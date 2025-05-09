// components/chat/utils/parseReferences.ts
import { PaperType } from "../../motion/Accordion";

export function parseReferences(referenceText: string): PaperType[] {
  if (!referenceText) return [];
  const lines = referenceText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && /^[A-Z]/.test(line)); // Only lines starting with a capital letter

  return lines.map((line, idx) => {
    // Example: Anderson, L. M., et al. (2023). Future directions in long COVID research. Journal of Medical Research, 45(3), 123-135.
    const match = line.match(
      /^(.+?)\s+\((\d{4})\)\.\s+(.+?)\.\s+(.+?),\s+(\d+\(\d+\)),\s+([\d\-–, ]+)\.?$/
    );
    if (!match) {
      // fallback: just return the whole line as title
      return {
        id: String(idx),
        title: line,
        year: NaN,
        authors: [],
        abstract: "",
        url: "",
        publicationVenue: { name: "" },
        doi: ""
      };
    }
    const [_, authorsStr, year, title, journal, volumeIssue, pages] = match;
    // Split authors by "et al." or comma
    const authors = authorsStr.replace(/et al\./i, "").split(",").map(name => ({ name: name.trim() })).filter(a => a.name);
    return {
      id: String(idx),
      title: title.trim(),
      year: Number(year),
      authors,
      abstract: "",
      url: "",
      publicationVenue: { name: journal.trim() },
      doi: ""
    };
  });
}

export function extractReferencesSection(text: string): string {
  const match = text.match(/References\s*\n([\s\S]*)/i);
  return match ? match[1].trim() : "";
}