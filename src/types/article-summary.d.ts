export type SummaryLang = "en" | "ja" | "zh";

export type ArticleSummary = {
  article_id: string;
  content: string;
  lang: SummaryLang;
  created_at: string;
  updated_at: string;
};

export type GenerateSummaryParams = {
  lang: SummaryLang;
};
