import { useState, MouseEvent } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";

import type { Tag } from "../../types/tag";

type ArticleTagSelectorProps = {
  existingTags: Array<Tag>;
  selectedTags: Array<Tag>;
  setSelectedTags: (selectedTags: Array<Tag>) => void;
}

function ArticleTagSelector({ existingTags, selectedTags, setSelectedTags }: ArticleTagSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onClickSelectTagButton = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickTagItem = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
    setAnchorEl(null);
  };

  const onRemoveTag = (tag: Tag) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
  };

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}>
      <Button variant="outlined" onClick={onClickSelectTagButton}>
        Select Tags
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {existingTags.map((tag, index) => (
          <MenuItem
            key={index}
            onClick={() => onClickTagItem(tag)}>
            {tag.name}
          </MenuItem>
        ))}
      </Menu>
      <Box sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        maxWidth: "100%",
      }}>
        {selectedTags.map((tag, index) => (
          <Chip
            key={index}
            label={tag.name}
            onDelete={() => onRemoveTag(tag)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default ArticleTagSelector;
