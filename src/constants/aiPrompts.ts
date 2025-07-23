/* eslint-disable no-unused-vars */
export const PROMPT_MAP: Record<
  'summarize' | 'tldr' | 'tell_more',
  (title: string, tags: string[], content: string) => string
> = {
  summarize: (title, tags, content) =>
    `You are an expert technical writer. Summarize the following article titled "${title}", tagged with [${tags.join(
      ', '
    )}]. Format your response in clean, minimal HTML suitable for frontend display. Do NOT add any id, class, or style attributes to the tags.\n\nContent:\n${content}`,

  tldr: (title, tags, content) =>
    `Provide a TL;DR version of this article titled "${title}", tagged with [${tags.join(
      ', '
    )}]. Keep it concise. Format the response in minimal, readable HTML and avoid using any id, class, or style attributes.\n\nContent:\n${content}`,

  tell_more: (title, tags, content) =>
    `Expand and explain in more depth the article titled "${title}", tagged with [${tags.join(
      ', '
    )}]. Return the response in clean HTML suitable for frontend rendering. Do not include any class, id, or inline style attributes in your output.\n\nContent:\n${content}`,
};
