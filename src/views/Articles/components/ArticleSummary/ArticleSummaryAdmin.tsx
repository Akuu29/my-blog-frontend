import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import type { SummaryLang } from "../../../../types/article-summary";

const LANG_OPTIONS: { value: SummaryLang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
];

function detectDefaultLang(): SummaryLang {
  const lang = navigator.language.split("-")[0];
  if (lang === "ja") return "ja";
  if (lang === "zh") return "zh";
  return "en";
}

type ArticleSummaryAdminProps = {
  hasSummary: boolean;
  isGenerating: boolean;
  isDeleting: boolean;
  onGenerate: (lang: SummaryLang) => void;
  onDelete: () => void;
};

function ArticleSummaryAdmin({
  hasSummary,
  isGenerating,
  isDeleting,
  onGenerate,
  onDelete,
}: ArticleSummaryAdminProps) {
  const [lang, setLang] = useState<SummaryLang>(detectDefaultLang);

  const handleGenerate = () => {
    onGenerate(lang);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this summary?")) {
      onDelete();
    }
  };

  const isMutating = isGenerating || isDeleting;

  return (
    <Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="summary-lang-label">Language</InputLabel>
          <Select
            labelId="summary-lang-label"
            value={lang}
            label="Language"
            onChange={(e) => setLang(e.target.value as SummaryLang)}
            disabled={isMutating}
          >
            {LANG_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          onClick={handleGenerate}
          disabled={isMutating}
          startIcon={isGenerating ? <CircularProgress size={14} color="inherit" /> : <AutoFixHighIcon fontSize="small" />}
        >
          {hasSummary ? "Regenerate" : "Generate"}
        </Button>

        {hasSummary && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDelete}
            disabled={isMutating}
            startIcon={isDeleting ? <CircularProgress size={14} color="inherit" /> : <DeleteIcon fontSize="small" />}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ArticleSummaryAdmin;
