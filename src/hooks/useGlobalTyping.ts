import { useEffect, useRef, useCallback } from "react";

interface UseGlobalTypingOptions {
  onTypingStart: (text: string) => void;
  enabled: boolean;
}

export const useGlobalTyping = ({
  onTypingStart,
  enabled,
}: UseGlobalTypingOptions) => {
  const typingBuffer = useRef<string>("");
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const isTypableCharacter = (key: string) => {
    // Check if it's a printable character (letter, number, space, punctuation)
    return key.length === 1 && !key.match(/[\u0000-\u001F\u007F-\u009F]/);
  };

  const shouldIgnoreTyping = (target: EventTarget | null) => {
    if (!target || !(target instanceof HTMLElement)) return true;

    // Ignore if typing in input fields, textareas, or contenteditable elements
    const tagName = target.tagName.toLowerCase();
    const isFormElement = ["input", "textarea", "select"].includes(tagName);
    const isContentEditable = target.isContentEditable;

    // Also ignore if target is within a form element
    const isWithinForm = target.closest(
      "input, textarea, select, [contenteditable]"
    );

    return isFormElement || isContentEditable || isWithinForm;
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if typing in form elements
      if (shouldIgnoreTyping(e.target)) return;

      // Ignore modifier keys, function keys, etc.
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Ignore special keys
      const ignoredKeys = [
        "Tab",
        "Enter",
        "Escape",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "Delete",
        "Insert",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
      ];

      if (ignoredKeys.includes(e.key)) return;

      // Check if it's a typable character
      if (isTypableCharacter(e.key)) {
        // Clear existing timer
        if (typingTimer.current) {
          clearTimeout(typingTimer.current);
        }

        // Handle backspace
        if (e.key === "Backspace") {
          typingBuffer.current = typingBuffer.current.slice(0, -1);
        } else {
          // Add character to buffer
          typingBuffer.current += e.key;
        }

        // If this is the first character, trigger typing start
        if (typingBuffer.current.length === 1 && e.key !== "Backspace") {
          e.preventDefault(); // Prevent the character from being typed elsewhere
          onTypingStart(typingBuffer.current);
        }

        // Set timer to clear buffer after typing stops
        typingTimer.current = setTimeout(() => {
          typingBuffer.current = "";
        }, 1000);
      }
    },
    [enabled, onTypingStart]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown, true);
      return () => {
        document.removeEventListener("keydown", handleKeyDown, true);
        if (typingTimer.current) {
          clearTimeout(typingTimer.current);
        }
      };
    }
  }, [handleKeyDown, enabled]);

  const clearBuffer = useCallback(() => {
    typingBuffer.current = "";
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }
  }, []);

  return { clearBuffer };
};
