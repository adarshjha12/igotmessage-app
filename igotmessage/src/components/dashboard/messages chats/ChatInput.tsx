import { useRef, useState, useEffect } from "react";

export default function ChatInput() {
  const containerRef = useRef<HTMLDivElement>(null); // scrollable chat container
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [inputValue, setInputValue] = useState("");

  // Auto-scroll to bottom whenever messages or input change
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior,
    });
  };

  // Initial scroll to bottom on mount
  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  // Scroll on input focus (mobile keyboard)
  const handleFocus = () => {
    // Slight delay allows keyboard resize/layout
    setTimeout(() => {
      scrollToBottom("smooth");
    }, 50);
  };

  // Adjust textarea height dynamically
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current;
    if (!ta) return;

    setInputValue(e.target.value);

    // Reset height and expand based on content
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; // max height 160px
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col overflow-auto gap-2"
    >
      {/* Simulated chat messages */}
      {/* <div style={{ height: "600px" }}></div> */}

      {/* Input box */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInput}
        onFocus={handleFocus}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 w-full scroll-hidden px-4 py-2 min-h-[44px] max-h-40 resize-none rounded-2xl outline-none bg-[var(--bgColor)] border border-[var(--borderColor)]/30 backdrop-blur-lg placeholder-[var(--textColor)]/60 text-lg placeholder:text-lg overflow-y-auto"
      />
    </div>
  );
}
