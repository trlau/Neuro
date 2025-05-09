"use client"

import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

/**
 * This example shows how to use the `motion.dialog`
 * component.
 */

export function Dialog({ children, close, confirmCallback, cancelCallback }: { children? : any, close: () => void, confirmCallback? : () => void, cancelCallback? : () => void }) {
    const ref = useRef<HTMLDialogElement>(null)

    /**
     * Use the dialog element's imperative API to open and close the dialog
     * when the component mounts and unmounts. This enables exit animations
     * and maintains the dialog's natural accessibility behaviour.
     */
    useEffect(() => {
        if (!ref.current) return

        ref.current.showModal()

        return () => ref.current?.close()
    }, [ref])

    // useClickOutside(ref, close)
    return (
        <>
            <motion.div
                className="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            ></motion.div>
            <motion.dialog
                initial={dialogInitialState}
                animate={dialogOpenState}
                exit={dialogInitialState}
                ref={ref}
                className="modal"
                open={false}
                /**
                 * The onCancel event is triggered when the user
                 * presses the Esc key. We prevent the default and
                 * close the dialog via the provided callback that
                 * first sets React state to false.
                 *
                 * AnimatePresence will take care of our exit animation
                 * before actually closing the dialog.
                 */
                onCancel={(event) => {
                    event.preventDefault()
                    close()
                }}
                /**
                 * However, if the Esc key is pressed twice, the
                 * close method will always fire, and it isn't cancellable.
                 * So we listen for this and make sure the React
                 * state is updated to false.
                 */
                onClose={close}
                style={{ transformPerspective: 500 }}
            >
                <h2 className="title">Send Feedback</h2>
                <p>Your feedback will be reviewed for LLM enhancement.</p>
                <div id="content" className="mt-4 pt-2">
                    {children}
                </div>
                <div className="controls">
                    <button onClick={() => {
                        close();
                        if (cancelCallback) {
                            cancelCallback()
                        } 
                        }} className="cancel">
                        Cancel
                    </button>
                    <button onClick={() => {
                        close();
                        if (confirmCallback) {
                            confirmCallback()
                        }
                        }} className="save">
                        Continue
                    </button>
                </div>
                <button
                    className="closeButton"
                    aria-label="Close"
                    onClick={close}
                >
                    <XIcon />
                </button>
            </motion.dialog>
            <StyleSheet />
        </>
    )
}

const dialogOpenState = {
    opacity: 1,
    filter: "blur(0px)",
    rotateX: 0,
    rotateY: 0,
    z: 0,
    transition: {
        delay: 0.2,
        duration: 0.5,
        ease: [0.17, 0.67, 0.51, 1],
        opacity: {
            delay: 0.2,
            duration: 0.5,
            ease: "easeOut",
        },
    },
}

const dialogInitialState = {
    opacity: 0,
    filter: "blur(10px)",
    z: -100,
    rotateY: 25,
    rotateX: 5,
    transformPerspective: 1500,
    transition: {
        duration: 0.3,
        ease: [0.67, 0.17, 0.62, 0.64],
    },
}

/**
 * ==============   Utils   ================
 */

function useClickOutside(
    ref: React.RefObject<HTMLDialogElement | null>,
    close: VoidFunction
) {
    useEffect(() => {
        const handleClickOutside = (event: React.MouseEvent<Element>) => {
            if (ref.current && checkClickOutside(event, ref.current)) {
                close()
            }
        }

        document.addEventListener("click", handleClickOutside as any)

        return () => {
            document.removeEventListener("click", handleClickOutside as any)
        }
    }, [ref])
}

function checkClickOutside(
    event: React.MouseEvent<Element>,
    element: HTMLDialogElement
) {
    const { top, left, width, height } = element.getBoundingClientRect()

    if (
        event.clientX < left ||
        event.clientX > left + width ||
        event.clientY < top ||
        event.clientY > top + height
    ) {
        return true
    }
}

/**
 * ==============   Types   ================
 */
interface Dialog {
    isOpen: boolean
    open: () => void
    close: () => void
    ref: React.RefObject<HTMLDialogElement | null>
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
    return (
        <style>{`
        .openButton, .controls button {
            background-color: var(--primary-color);
            color: #f5f5f5;
            font-size: 16px;
            padding: 10px 20px;
            border-radius: 10px;
        }

        .controls {
            border-top: 1px solid var(--divider);
            padding-top: 20px;
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .controls button.cancel {
            background-color: var(--divider);
        }

        .modal {
            border-radius: 10px;
            border: 1px solid #1d2628;
            background-color: #0b1011;
            position: relative;
            z-index: 10000000;
            padding: 20px;
            min-width: 800px;
        }

        .modal p {
            margin: 0;
        }

        .modal::backdrop {
            display: none;
        }

        .title {
            font-size: 24px;
            margin: 0 0 20px;
        }

        .closeButton {
            position: absolute;
            top: 20px;
            right: 20px;
        }

        .overlay {
            background: rgba(0, 0, 0, 0.5);
            position: fixed;
            inset: 0;
            z-index: 9999999;
            backdrop-filter: blur(3px);
        }
    `}</style>
    )
}
