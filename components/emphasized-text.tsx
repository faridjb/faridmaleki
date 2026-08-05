/**
 * Matches a percentage figure (with optional leading "~" and trailing "+", e.g. "~80%+")
 * or a time/quantity transformation joining two values with an arrow or the word "to"
 * (e.g. "6 weeks → 30 minutes", "6 weeks to 30 minutes").
 */
const EMPHASIS_PATTERN =
  /(~?\d+(?:\.\d+)?%\+?|\d+\s*(?:weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?)\s*(?:→|->|to)\s*\d+\s*(?:weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?))/gi;

interface EmphasizedTextProps {
  text: string;
}

/**
 * Renders free text with any percentage figure or "X → Y" style outcome visually
 * emphasized in the success token, so the measured figure reads as the headline
 * rather than being buried in a sentence — used for achievement/result bullets.
 */
export function EmphasizedText({ text }: EmphasizedTextProps) {
  const parts = text.split(EMPHASIS_PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="text-success font-medium">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
