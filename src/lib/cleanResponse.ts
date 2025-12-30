export const cleanResponse = (text: string): string => {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove reasoning meta
    .replace(/(As an AI,|I am a language model)/gi, '')
    .trim();
};

export const applyEmojiRules = (text: string): string => {
  if (text.toLowerCase().includes("hello") || text.toLowerCase().includes("hi")) return text + " 👋";
  if (text.toLowerCase().includes("success") || text.toLowerCase().includes("done")) return text + " ✅";
  if (text.toLowerCase().includes("ai") || text.toLowerCase().includes("robot")) return text + " 🤖";
  return text;
};
