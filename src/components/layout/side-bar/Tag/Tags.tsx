import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { UserStatusContext } from "../../../../contexts/UserStatusContext";
import { ErrorSnackbarContext } from "../../../../contexts/ErrorSnackbarContext";
import handleError from "../../../../utils/handle-error";
import type { ErrorResponse } from "../../../../types/error-response";
import type { UserStatusContextProps } from "../../../../types/user-status-context";
import type { ErrorSnackbarContextProps } from "../../../../types/error-snackbar-context";
import type { Tag, NewTag } from "../../../../types/tag";
import TagApi from "../../../../services/tag-api";
import LongMenu from "../../LongMenu";


const theme = createTheme({
  typography: {
    fontFamily: 'monospace',
  },
});

const OPTIONS = [
  "Delete",
];

const DELETE_CONFIRM_MESSAGE = `Deleted tags are also deleted from the associated articles.
Are you sure you want to delete it?`;

function TagCheckBox({
  tag,
  index,
  deleteTagHandler,
}: {
  tag: Tag,
  index: number,
  deleteTagHandler: (tag: Tag) => void,
}) {
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;

  const deleteTag = () => {
    if (window.confirm(DELETE_CONFIRM_MESSAGE)) {
      deleteTagHandler(tag);
    }
  };

  const handleClickMenuItem = (option: string) => {
    switch (option) {
      case "Delete":
        deleteTag();
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{
      display: "flex",
    }}>
      <FormControlLabel
        control={<Checkbox />}
        label={tag.name}
        key={index}
      />
      {userStatus.isLoggedIn && (
        <LongMenu options={OPTIONS} clickMenuItemHandler={handleClickMenuItem} />
      )}
    </Box>
  );
}

function TagContainer({
  tags,
  deleteTagHandler,
}: {
  tags: Array<Tag>,
  deleteTagHandler: (tag: Tag) => void,
}) {
  const leftRow: Array<Tag> = [];
  const rightRow: Array<Tag> = [];
  tags.map((tag, index) => {
    if (index % 2 === 0) {
      leftRow.push(tag);
    } else {
      rightRow.push(tag);
    }
  });

  return (
    <Box sx={{ display: "flex" }}>
      <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
        <FormGroup>
          {leftRow.map((tag, index) => (
            <TagCheckBox tag={tag} index={index} deleteTagHandler={deleteTagHandler} />
          ))}
        </FormGroup>
      </FormControl>
      <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
        <FormGroup>
          {rightRow.map((tag, index) => (
            <TagCheckBox tag={tag} index={index} deleteTagHandler={deleteTagHandler} />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}


function Tags() {
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

  // handle add tag
  const [addTag, setAddTag] = useState(false);
  const handleClickAddIcon = () => {
    setAddTag(true);
  };
  const handleClickRemoveIcon = () => {
    setAddTag(false);
  };

  const [newTag, setNewTag] = useState<NewTag>({ name: "" });
  const handleChangeNewTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag({ name: event.target.value });
  };

  const handleSubmitNewTag = async () => {
    const result = await TagApi.create(newTag);

    if (result.isOk()) {
      setTags([...tags, result.unwrap()]);
      setNewTag({ name: "" });
    } else {
      handleError((result.unwrap() as ErrorResponse), navigate, openSnackbar, "top", "right");
    }
  };

  // handle delete tag
  const handleDeleteTag = async (tag: Tag) => {
    const result = await TagApi.delete(tag.id);

    if (result.isOk()) {
      setTags(tags.filter((t) => t.id !== tag.id));
    } else {
      handleError((result.unwrap() as ErrorResponse), navigate, openSnackbar, "top", "right");
    }
  };

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
          <IconButton onClick={handleClickAddIcon}>
            <AddIcon />
          </IconButton>
        )}
        {userStatus.isLoggedIn && addTag && (
          <IconButton onClick={handleClickRemoveIcon}>
            <RemoveIcon />
          </IconButton>
        )}
      </Box>
      {userStatus.isLoggedIn && addTag && (
        <Box
          component={"form"}
          onSubmit={handleSubmitNewTag}
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
            onChange={handleChangeNewTag}
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
      <TagContainer tags={tags} deleteTagHandler={handleDeleteTag} />
    </ThemeProvider>
  );
}

export default Tags;
