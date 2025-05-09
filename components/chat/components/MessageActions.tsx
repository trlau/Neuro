
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

    function handleOnClick() {
        setDialogOpen(true);
    }

    const [isDialogOpened, setDialogOpen] = useState(false);

    return (
        <>
            <button onClick={() => { handleOnClick() }} className="w-8">
                <ThumbsUpIcon size={20}></ThumbsUpIcon>
            </button>
            <AnimatePresence>
                {isDialogOpened && 
                <Dialog confirmCallback={() => {handleActionReducer("thumbs-up", { positivity: true, content: content })}} close={() => setDialogOpen(false)}>
                    <fieldset className="flex flex-col">
                        <label>Comment</label>
                        <textarea className="text-clip bg-slate-900 rounded-xl border-spacing-1 border-slate-700 overflow-hidden"></textarea>
                    </fieldset>
                    
                </Dialog>}
            </AnimatePresence>
        </>
    )
}

function ThumbsDownAction({ content }: any) {
    
    function handleOnClick() {
        setDialogOpen(true);
    }

    const [isDialogOpened, setDialogOpen] = useState(false);

    return (
        <>
            <button onClick={() => { handleOnClick() }} className="w-8">
                <ThumbsDownIcon size={20}></ThumbsDownIcon>
            </button>
            <AnimatePresence>
                {isDialogOpened && 
                <Dialog confirmCallback={() => {handleActionReducer("thumbs-down", { positivity: false, content: content })}} close={() => setDialogOpen(false)}>
                    <fieldset className="flex flex-col">
                        <label>Comment</label>
                        <textarea className="text-clip bg-slate-900 rounded-xl border-spacing-1 border-slate-700 overflow-hidden"></textarea>
                    </fieldset>
                    
                </Dialog>}
            </AnimatePresence>
        </>
    )
}

function CopyMessageAction({ content }: any) {
    return (
        <button onClick={() => { handleActionReducer("copy-message", { content: content }) }} className="w-8">
            <Clipboard size={20}></Clipboard>
        </button>
    )
}

function MessageActions({ content }: any) {
    return (
        <div className="flex mt-2">
            <ThumbsUpAction content={content}></ThumbsUpAction>
            <ThumbsDownAction content={content}></ThumbsDownAction>
            <CopyMessageAction content={content}></CopyMessageAction>
        </div>
    )
}

export { MessageActions }