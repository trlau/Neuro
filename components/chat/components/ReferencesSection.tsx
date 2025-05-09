import React, { useMemo } from "react";
import RadixAccordion from "../../motion/Accordion";
import { parseReferences, extractReferencesSection } from "../utils/parseReferences";

interface ReferencesSectionProps {
  aiResponse: string; // The full AI response text, including "References"
}

const ReferencesSection: React.FC<ReferencesSectionProps> = ({ aiResponse }) => {
  const papers = useMemo(() => {
    const refText = extractReferencesSection(aiResponse);
    // Debugging
    // console.log("Extracted references text:", refText);
    const parsed = parseReferences(refText);
    // console.log("Parsed papers:", parsed);
    return parsed;
  }, [aiResponse]);

  if (!papers || papers.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">References</h2>
      <RadixAccordion papers={papers} />
    </div>
  );
};

export default ReferencesSection;