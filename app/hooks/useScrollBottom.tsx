import { RefObject, useEffect } from "react";

// Reusable hook for scrolling to the bottom
const useScrollTo = (ref: RefObject<HTMLDivElement | null>, autoScroll = true, smooth = true) => {

    // Function to trigger scroll to the bottom manually
    const scrollToTarget = () => {
        ref.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
        });
    }

    // Ensure scroll happens after render
    useEffect(() => {
        const scrollToTargetAfterRender = () => {
            if (autoScroll && ref.current) {
                ref.current.scrollIntoView({
                    behavior: smooth ? "smooth" : "auto",
                });
            }
        };

        // Set a slight timeout to ensure the DOM is fully updated
        const timeoutId = setTimeout(scrollToTargetAfterRender, 100);
        return () => clearTimeout(timeoutId); // Cleanup the timeout if needed
    }, [autoScroll, smooth, ref]);

    return scrollToTarget;
};

export default useScrollTo;