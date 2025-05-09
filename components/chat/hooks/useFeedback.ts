import { addFeedback } from "../utils/firebaseUtils";




export function useFeedback() {
    function createFeedback(positivity: string, content: string) {
        addFeedback(positivity, content);
    }

    return {createFeedback}
}