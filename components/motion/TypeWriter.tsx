
import { animate, motion, useMotionValue } from "motion/react"
import { useEffect } from "react"

export default function Typewriter({
    text = "Hello world!",
}: {
    text?: string
}) {
    const children = useMotionValue("")

    useEffect(() => {
        const animation = animate(0, text.length, {
            duration: 1.5,
            ease: "linear",
            onUpdate: (latest) => {
                children.set(text.slice(0, Math.ceil(latest)))
            },
        })

        return () => animation.stop()
    }, [text, children])

    return (
        <>
            <h2 style={title}>
                <motion.span>{children}</motion.span>
                <motion.div
                    style={cursor}
                    animate={{
                        opacity: [1, 1, 0, 0],
                        transition: {
                            duration: 1,
                            repeat: Infinity,
                            times: [0, 0.5, 0.5, 1],
                        },
                    }}
                />
            </h2>
        </>
    )
}

/**
 * ==============   Styles   ================
 */

const title: React.CSSProperties = {
    position: "relative",
}

const monospace: React.CSSProperties = {
    fontFamily: `"Azeret Mono", monospace`,
}

const cursor: React.CSSProperties = {
    position: "absolute",
    right: -10,
    top: 0,
    bottom: 0,
    background: "#3b82f6",
    width: 2,
    opacity: 0,
}
