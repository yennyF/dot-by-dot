import { useEffect, useState, RefObject } from "react";

const useOnScreen = (ref: RefObject<HTMLElement | null>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust the threshold to trigger when 10% of the element is visible
    );
    const refCurrent = ref.current;

    if (refCurrent) {
      observer.observe(refCurrent);
    }

    return () => {
      if (refCurrent) {
        observer.unobserve(refCurrent);
      }
    };
  }, [ref]);

  return isVisible;
};

export default useOnScreen;
