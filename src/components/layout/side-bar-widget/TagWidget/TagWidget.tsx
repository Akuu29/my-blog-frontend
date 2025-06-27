import React, { useEffect, useState, useContext } from "react";
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
import type { ErrorResponse } from "../../../../types/error-response";
import type { UserStatusContextProps } from "../../../../types/user-status-context";
import type { ErrorSnackbarContextProps } from "../../../../types/error-snackbar-context";
import type { Tag, NewTag } from "../../../../types/tag";

const theme = createTheme({
  typography: {
    fontFamily: 'monospace',
  },
});

type TagWidgetProps = {
  setSelectedTags: (tag_ids: Array<Tag>) => void;
};

function TagWidget({ setSelectedTags }: TagWidgetProps) {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [tags, setTags] = useState<Array<Tag>>([]);
  useEffect(() => {
    (async () => {
      const result = await TagApi.all();

      if (result.isOk()) {
        setTags(result.unwrap());
      } else {
        handleError((result.unwrap() as ErrorResponse), navigate, openSnackbar, "top", "right");
      }
    })();
  }, [navigate, openSnackbar]);

  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());

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

  const onSubmitNewTag = async () => {
    const result = await TagApi.create(newTag);

    if (result.isOk()) {
      setTags([...tags, result.unwrap()]);
      setNewTag({ name: "" });
    } else {
      handleError((result.unwrap() as ErrorResponse), navigate, openSnackbar, "top", "right");
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    const result = await TagApi.delete(tag.id);

    if (result.isOk()) {
      setTags(tags.filter((t) => t.id !== tag.id));
    } else {
      handleError((result.unwrap() as ErrorResponse), navigate, openSnackbar, "top", "right");
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
  }, [selectedTagIds, tags]);

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
        {userStatus.isLoggedIn && !addTag && (
          <IconButton onClick={onClickAddIcon}>
            <AddIcon />
          </IconButton>
        )}
        {userStatus.isLoggedIn && addTag && (
          <IconButton onClick={onClickRemoveIcon}>
            <RemoveIcon />
          </IconButton>
        )}
      </Box>
      {userStatus.isLoggedIn && addTag && (
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
              userStatus.isLoggedIn && (
                <TagAdminMenu deleteTag={() => handleDeleteTag(tag)} />
              )
            }
          />
        ))}
      </TagList>
    </ThemeProvider>
  );
}

export default TagWidget;
