import { RefObject, useEffect } from "react";

const useScrollTo = (
    ref: RefObject<HTMLDivElement | null>, 
    autoScroll = true, 
    smooth = true, 
    block: ScrollLogicalPosition = "end"
) => {

    // Function to trigger scroll to the bottom manually
    const scrollToTarget = () => {
        ref.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block,
        });
    }

    // Ensure scroll happens after render
    useEffect(() => {
        const scrollToTargetAfterRender = () => {
            if (autoScroll && ref.current) {
                ref.current.scrollIntoView({
                    behavior: smooth ? "smooth" : "auto",
                    block,
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