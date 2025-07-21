export const highlightText = (text, query) => {
  if (!query) return text;
  if (!text) return text;
  const regex = new RegExp(`(${query})`, "ig");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <span key={i} style={{ backgroundColor: "#ffe066", color: "#000", borderRadius: 3 }}>{part}</span>
      : part
  );
};
