import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import TagCheckBox from "./TagCheckBox";
import TagList from "./TagList";
import TagAdminMenu from "./TagAdminMenu";
import TagApi from "../../../../services/tag-api";
import { UserStatusContext } from "../../../../contexts/UserStatusContext";
import { ErrorSnackbarContext } from "../../../../contexts/ErrorSnackbarContext";
import handleError from "../../../../utils/handle-error";
import type { UserStatusContextProps } from "../../../../types/user-status-context";
import type { ErrorSnackbarContextProps } from "../../../../types/error-snackbar-context";
import type { Tag, NewTag } from "../../../../types/tag";

const theme = createTheme({
  typography: {
    fontFamily: 'monospace',
  },
});

type TagWidgetProps = {
  setSelectedTags: (tags: Array<Tag>) => void;
  userId: string;
  showAdminMenu?: boolean;
};

function TagWidget({ setSelectedTags, userId, showAdminMenu }: TagWidgetProps) {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const [tags, setTags] = useState<Array<Tag>>([]);
  useEffect(() => {
    (async () => {
      const result = await TagApi.all({ userId });

      if (result.isOk()) {
        const body = result.unwrap();
        setTags(body.items);
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "right");
      }
    })();
  }, [navigate, userId]);

  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());

  const [addTag, setAddTag] = useState(false);
  const onClickAddIcon = () => {
    setAddTag(true);
  };
  const onClickRemoveIcon = () => {
    setAddTag(false);
  };

  const [newTag, setNewTag] = useState<NewTag>({ name: "" });
  const onChangeNewTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag({ name: event.target.value });
  };

  const onSubmitNewTag = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const raw = data.get("tag");
    const tagName = typeof raw === "string" ? raw.trim() : "";

    if (!tagName) {
      return;
    }

    const result = await TagApi.create({ name: tagName });

    if (result.isOk()) {
      setTags((prev) => [...prev, result.unwrap()]);
      setNewTag({ name: "" });
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "right");
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    const result = await TagApi.delete(tag.id);

    if (result.isOk()) {
      setTags(tags.filter((t) => t.id !== tag.id));
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "right");
    }
  };

  const onChangeTagCheckBox = (tag: Tag, checked: boolean) => {
    setSelectedTagIds((prev) => {
      const newSelectedTagIds = new Set(prev);
      if (checked) {
        newSelectedTagIds.add(tag.id);
      } else {
        newSelectedTagIds.delete(tag.id);
      }
      return newSelectedTagIds;
    });
  };

  // Change selected tags when selectedTagIds changes
  useEffect(() => {
    const selectedTags: Array<Tag> = Array.from(selectedTagIds).map((id) => {
      const tag = tags.find((t) => t.id === id);
      if (tag) {
        return tag;
      }
    }).filter((tag) => tag !== undefined) as Array<Tag>;

    setSelectedTags(selectedTags);
  }, [selectedTagIds, tags, setSelectedTags]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
      }}>
        <Typography sx={{
          variant: "h1",
          fontWeight: 600,
          p: 1,
        }}>
          Tag
        </Typography>
        {showAdminMenu && !addTag && (
          <IconButton onClick={onClickAddIcon}>
            <AddIcon />
          </IconButton>
        )}
        {showAdminMenu && addTag && (
          <IconButton onClick={onClickRemoveIcon}>
            <RemoveIcon />
          </IconButton>
        )}
      </Box>
      {userStatus.isLoggedIn && userId && userStatus.currentUserId === userId && addTag && (
        <Box
          component={"form"}
          onSubmit={onSubmitNewTag}
          sx={{
            p: 1,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <TextField
            label="Add tag"
            variant="standard"
            name="tag"
            value={newTag.name}
            onChange={onChangeNewTag}
            sx={{ flexGrow: 1, mr: 1, }}
          />
          <Button
            variant="outlined"
            type="submit"
          >
            Add
          </Button>
        </Box>
      )}
      <TagList>
        {tags.map((tag, index) => (
          <TagCheckBox
            tag={tag}
            index={index}
            key={tag.id}
            checked={selectedTagIds.has(tag.id)}
            onChange={() => onChangeTagCheckBox(tag, !selectedTagIds.has(tag.id))}
            adminMenu={
              <TagAdminMenu deleteTag={() => handleDeleteTag(tag)} showAdminMenu={showAdminMenu} />
            }
          />
        ))}
      </TagList>
    </ThemeProvider>
  );
}

export default TagWidget;
