import { useEffect, useState } from "react";

export const useTypewriterEffect = (content, speed = 50) => {
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      setDisplayedContent((prevContent) => {
        const currentChar = content[currentIndex++];
        if (!currentChar) {
          clearInterval(intervalId);
          return prevContent;
        }
        return prevContent + currentChar;
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [content, speed]);

  return displayedContent;
};
