// Lightweight, dependency-free ATS-style keyword matcher.
// Not "AI" in the LLM sense - it's a transparent, explainable scorer,
// which is actually closer to how real ATS keyword filters work.

const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","so","of","to","in","on","for",
  "with","as","by","at","from","is","are","was","were","be","been","being",
  "this","that","these","those","it","its","you","your","our","we","they",
  "will","can","should","must","have","has","had","do","does","did","not",
  "into","about","over","under","between","across","per","etc","using",
  "including","such","also","who","what","when","where","which","how",
]);

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function extractKeywords(text, limit = 40) {
  const words = tokenize(text);
  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function scoreResumeAgainstJob(resumeText, jobDescription) {
  const jdKeywords = extractKeywords(jobDescription, 30);
  const resumeWords = new Set(tokenize(resumeText));

  const matched = jdKeywords.filter((kw) => resumeWords.has(kw));
  const missing = jdKeywords.filter((kw) => !resumeWords.has(kw));

  const matchPercent = jdKeywords.length
    ? Math.round((matched.length / jdKeywords.length) * 100)
    : 0;

  return {
    matchPercent,
    matchedKeywords: matched,
    missingKeywords: missing,
  };
}
