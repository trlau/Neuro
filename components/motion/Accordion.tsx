"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import { useState } from "react"

type paperSourceType = {
    id: string,
    title: string,
    year: number,
    abstract: string,
    authors: {
        name: string
    }[]
    url: string
}

const accordionContent : paperSourceType[] = [
    {
        id: "what-is",
        title: "Distribution of software engineering concepts beyond the software engineering course",
        year: 2024,
        abstract: "Yes",
        authors: [
            {name: "Khoo Ji Qiang"}
        ],
        url: "https://www.semanticscholar.org/paper/0e4b9c0a6ccc68d7a16d80b8239cff416da7b67b"
    }
]

function RadixAccordion() {
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
                {accordionContent.map((item) => (
                    <AccordionItem
                        key={item.id}
                        item={item}
                        isOpen={value === item.id}
                        value={item.id}
                        setValue={setValue}
                    />
                ))}
            </Accordion.Root>
            <StyleSheet />
        </MotionConfig>
    )
}

type AccordionItemProps = {
    item: paperSourceType
    isOpen: boolean
    value: string
    setValue: (value: string) => void
}

function AccordionItem({ item, isOpen, setValue, value }: AccordionItemProps) {
    const [hasFocus, setHasFocus] = useState(false)

    return (
        <Accordion.Item value={value} className="section">
            <Accordion.Header>
                <Accordion.Trigger asChild>
                    <motion.button
                        className="trigger not-default"
                        onFocus={onlyKeyboardFocus(() => setHasFocus(true))}
                        onBlur={() => setHasFocus(false)}
                        whileTap="pressed"
                        onClick={() => setValue(isOpen ? "" : value)}
                    >
                        <span>{item.title}</span>
                        <ChevronDownIcon isOpen={isOpen} />
                        {hasFocus && (
                            <motion.div
                                layoutId="focus-ring"
                                className="focus-ring"
                                variants={{
                                    pressed: { scale: 0.9 },
                                }}
                                transition={{
                                    type: "spring",
                                    visualDuration: 0.2,
                                    bounce: 0.2,
                                }}
                            />
                        )}
                    </motion.button>
                </Accordion.Trigger>
            </Accordion.Header>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <Accordion.Content forceMount asChild>
                        <motion.div
                            className="accordion-content"
                            variants={{
                                open: {
                                    height: "auto",
                                    maskImage:
                                        "linear-gradient(to bottom, black 100%, transparent 100%)",
                                },
                                closed: {
                                    height: 0,
                                    maskImage:
                                        "linear-gradient(to bottom, black 50%, transparent 100%)",
                                },
                            }}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <motion.div
                                variants={{
                                    open: {
                                        filter: "blur(0px)",
                                        opacity: 1,
                                    },
                                    closed: {
                                        filter: "blur(2px)",
                                        opacity: 0,
                                    },
                                }}
                            >
                                <div className="content-inner">
                                    <p><b>Url: </b><a href={item.url}>{item.url}</a></p>
                                    <p><b>Bibliography: </b></p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Accordion.Content>
                )}
            </AnimatePresence>
            <hr />
        </Accordion.Item>
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
        `}</style>
    )
}

export default RadixAccordion
