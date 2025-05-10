"use client";

import { Clipboard, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useFeedback } from "../hooks/useFeedback";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Dialog } from "../../motion/Modal";

function handleActionReducer(action: string, payload: any) {
    const feedbacks = useFeedback();
    switch (action) {
        case "thumbs-up":
            feedbacks.createFeedback(payload.positivity, payload.content);
            break;
        case "thumbs-down":
            break;
        case "copy-message":
            navigator.clipboard.writeText(payload.content);
            break;
    }
}

function ThumbsUpAction({ content }: any) {
    const [isDialogOpened, setDialogOpen] = useState(false);
    function handleOnClick() {
        setDialogOpen(true);
    }
    return (
        <>
            <button
                onClick={handleOnClick}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white font-semibold shadow-sm hover:bg-white hover:text-black hover:border-white hover:shadow-lg focus:ring-2 focus:ring-white/40 transition-all"
                aria-label="Like"
                title="Like this response and provide feedback"
            >
                <ThumbsUpIcon size={20} />
            </button>
            <AnimatePresence>
                {isDialogOpened && 
                <Dialog confirmCallback={() => {handleActionReducer("thumbs-up", { positivity: true, content: content })}} close={() => setDialogOpen(false)}>
                    <fieldset className="flex flex-col">
                        <label>Comment</label>
                        <textarea className="text-clip bg-zinc-800 rounded-xl border-spacing-1 border-zinc-700 overflow-hidden"></textarea>
                    </fieldset>
                </Dialog>}
            </AnimatePresence>
        </>
    )
}

function ThumbsDownAction({ content }: any) {
    const [isDialogOpened, setDialogOpen] = useState(false);
    function handleOnClick() {
        setDialogOpen(true);
    }
    return (
        <>
            <button
                onClick={handleOnClick}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white font-semibold shadow-sm hover:bg-white hover:text-black hover:border-white hover:shadow-lg focus:ring-2 focus:ring-white/40 transition-all"
                aria-label="Dislike"
                title="Dislike this response and provide feedback"
            >
                <ThumbsDownIcon size={20} />
            </button>
            <AnimatePresence>
                {isDialogOpened && 
                <Dialog confirmCallback={() => {handleActionReducer("thumbs-down", { positivity: false, content: content })}} close={() => setDialogOpen(false)}>
                    <fieldset className="flex flex-col">
                        <label>Comment</label>
                        <textarea className="text-clip bg-zinc-800 rounded-xl border-spacing-1 border-zinc-700 overflow-hidden"></textarea>
                    </fieldset>
                </Dialog>}
            </AnimatePresence>
        </>
    )
}

function CopyMessageAction({ content }: any) {
    return (
        <button
            onClick={() => { handleActionReducer("copy-message", { content: content }) }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white font-semibold shadow-sm hover:bg-white hover:text-black hover:border-white hover:shadow-lg focus:ring-2 focus:ring-white/40 transition-all"
            aria-label="Copy message"
            title="Copy this message to clipboard"
        >
            <Clipboard size={20} />
        </button>
    )
}

function MessageActions({ content }: any) {
    return (
        <div className="flex mt-2 gap-2">
            <ThumbsUpAction content={content}></ThumbsUpAction>
            <ThumbsDownAction content={content}></ThumbsDownAction>
            <CopyMessageAction content={content}></CopyMessageAction>
        </div>
    )
}

export { MessageActions }