import { useState, MouseEvent } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LabelIcon from "@mui/icons-material/Label";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Tag } from "../../types/tag";

type ArticleTagSelectorProps = {
  existingTags: Array<Tag>;
  selectedTags: Array<Tag>;
  setSelectedTags: (selectedTags: Array<Tag>) => void;
}

function ArticleTagSelector({ existingTags, selectedTags, setSelectedTags }: ArticleTagSelectorProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(null);

  const onClickTagItem = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
    setMenuAnchorEl(null);
  };

  const onRemoveTag = (tag: Tag) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
  };

  const unselectedTags = existingTags.filter(
    (tag) => !selectedTags.some((t) => t.id === tag.id)
  );

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Button
        variant="outlined"
        startIcon={<LabelIcon />}
        onClick={(event: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(event.currentTarget)}
      >
        Select Tag
      </Button>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        {unselectedTags.map((tag) => (
          <MenuItem
            key={tag.id}
            onClick={() => onClickTagItem(tag)}
          >
            {tag.name}
          </MenuItem>
        ))}
      </Menu>
      <Badge badgeContent={selectedTags.length} color="primary">
        <IconButton
          onClick={(event: MouseEvent<HTMLElement>) => setPopoverAnchorEl(event.currentTarget)}
          sx={{ padding: '2px' }}
        >
          <LocalOfferIcon />
        </IconButton>
      </Badge>
      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={() => setPopoverAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 1, minWidth: 240 }}>
          {selectedTags.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
              No tags selected
            </Typography>
          ) : (
            <List dense disablePadding>
              {selectedTags.map((tag, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => onRemoveTag(tag)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText primary={tag.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </Stack>
  );
}

export default ArticleTagSelector;
