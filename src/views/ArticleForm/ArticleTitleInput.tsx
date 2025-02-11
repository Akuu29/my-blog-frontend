import { ChangeEvent } from "react";
import TextField from "@mui/material/TextField";

type TitleInputProps = {
  title: string,
  setTitle: (title: string) => void,
}

function ArticleTitleInput({ title, setTitle }: TitleInputProps) {
  const onChangeTitle = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTitle(event.target.value);
  };

  return (
    <TextField
      label="Title"
      variant="standard"
      value={title}
      sx={{ width: "100%" }}
      inputProps={{
        style: {
          overflow: "auto",
          whiteSpace: "nowrap",
        }
      }}
      onChange={onChangeTitle}
    />
  );
}

export default ArticleTitleInput;
