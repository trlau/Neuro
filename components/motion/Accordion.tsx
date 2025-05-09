"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import { useState } from "react"

export type PaperType = {
    id: string,
    title: string,
    year: number,
    abstract: string,
    authors: { name: string }[],
    url: string,
    publicationVenue?: { name: string, url?: string },
    doi?: string
}

interface RadixAccordionProps {
    papers: PaperType[]
}

function RadixAccordion({ papers }: RadixAccordionProps) {
    const [value, setValue] = useState<string>("")

    return (
        <MotionConfig
            transition={{ type: "spring", bounce: 0.2, visualDuration: 0.4 }}
        >
            <Accordion.Root
                type="single"
                value={value}
                onValueChange={setValue}
                className="accordion"
            >
                <Accordion.Item value="papers-table" className="section">
                    <Accordion.Header>
                        <Accordion.Trigger asChild>
                            <motion.button
                                className="trigger not-default"
                                whileTap="pressed"
                                onClick={() => setValue(value === "papers-table" ? "" : "papers-table")}
                            >
                                <span>Search Results</span>
                                <ChevronDownIcon isOpen={value === "papers-table"} />
                            </motion.button>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <AnimatePresence initial={false}>
                        {value === "papers-table" && (
                            <Accordion.Content forceMount asChild>
                                <motion.div
                                    className="accordion-content"
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={{
                                        open: { height: "auto", opacity: 1 },
                                        closed: { height: 0, opacity: 0 },
                                    }}
                                >
                                    <div className="content-inner overflow-x-auto">
                                        <table className="min-w-full text-left text-sm text-white border-separate border-spacing-y-2">
                                            <thead>
                                                <tr className="bg-zinc-800">
                                                    <th className="px-4 py-2">Title</th>
                                                    <th className="px-4 py-2">Authors</th>
                                                    <th className="px-4 py-2">Year</th>
                                                    <th className="px-4 py-2">Journal</th>
                                                    <th className="px-4 py-2">DOI/URL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {papers.map((paper) => (
                                                    <tr key={paper.id} className="bg-zinc-900 hover:bg-zinc-800 transition-colors">
                                                        <td className="px-4 py-2 font-medium max-w-xs truncate" title={paper.title}>{paper.title}</td>
                                                        <td className="px-4 py-2 max-w-xs truncate" title={paper.authors.map(a => a.name).join(", ")}>{paper.authors.map(a => a.name).join(", ")}</td>
                                                        <td className="px-4 py-2">{paper.year}</td>
                                                        <td className="px-4 py-2 max-w-xs truncate" title={paper.publicationVenue?.name}>{paper.publicationVenue?.name || "-"}</td>
                                                        <td className="px-4 py-2">
                                                            {paper.doi ? (
                                                                <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">DOI</a>
                                                            ) : paper.url ? (
                                                                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Link</a>
                                                            ) : "-"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            </Accordion.Content>
                        )}
                    </AnimatePresence>
                    <hr />
                </Accordion.Item>
            </Accordion.Root>
            <StyleSheet />
        </MotionConfig>
    )
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isOpen ? 180 : 0 }}
            style={{ willChange: "transform" }}
        >
            <path d="m6 9 6 6 6-6" />
        </motion.svg>
    )
}

function onlyKeyboardFocus(callback: () => void) {
    return (e: React.FocusEvent<HTMLButtonElement>) => {
        if (e.type === "focus" && e.target.matches(":focus-visible")) {
            callback()
        }
    }
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
    return (
        <style>{`
            .accordion {
                display: flex;
                flex-direction: column;
                background: #0b1011;
                border: 1px solid #1d2628;
                border-radius: 10px;
                min-width: 300px;
                width: 100%;
            }

            .accordion h3 {
                margin: 0;
                display: flex;
            }

            .section {
                padding: 20px;
                position: relative;
            }

            .trigger {
                width: 100%;
                border: none;
                padding: 0;
                color: #f5f5f5;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
            }

            .trigger span,
            .trigger svg {
                text-align: left;
                z-index: 1;
                position: relative;
            }

            .focus-ring {
                position: absolute;
                inset: -10px;
                background: var(--hue-4-transparent);
                border-radius: 5px;
                z-index: 0;
            }

            hr {
                margin: 0;
                border: 0;
                border-bottom: 1px solid #1d2628;
                position: absolute;
                bottom: 0;
                left: 20px;
                right: 20px;
                z-index: 0;
            }

            @media (max-width: 500px) {
                .accordion { width: 300px; }

                .trigger span {
                    font-size: 0.9rem;
                }

                .content-inner {
                    font-size: 0.85rem;
                }
            }

            .section:last-child hr {
                display: none;
            }

            .accordion-content {
                overflow: hidden;
            }

            .content-inner {
                padding: 20px 0 0;
                line-height: 1.5;
            }

            .content-inner p {
                margin: 0;
                padding: 0;
            }

            .content-inner p + p {
                margin-top: 1em;
            }

            table { border-collapse: separate; border-spacing: 0 8px; }
            th, td { white-space: nowrap; }
        `}</style>
    )
}

export default RadixAccordion
