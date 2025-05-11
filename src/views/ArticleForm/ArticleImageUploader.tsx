import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import handleError from "../../utils/handle-error";
import { ErrorSnackbarContext } from "../../contexts/ErrorSnackbarContext";
import ImageApi from "../../services/image-api";
import type { ErrorSnackbarContextProps } from "../../types/error-snackbar-context";
import type { Image } from "../../types/image";

type ArticleImageUploaderProps = {
  articleId: string | undefined;
  uploadedImages: Array<Image>;
  setUploadedImages: (images: Array<Image>) => void;
  onImageUpload: (filename: string, imageUrl: string) => void;
  onDeleteImage: (filename: string, imageUrl: string) => void;
}

function ArticleImageUploader({ articleId, uploadedImages, setUploadedImages, onImageUpload, onDeleteImage }: ArticleImageUploaderProps) {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;

  const uploadImage = async (file: File, articleId: string): Promise<Image | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("article_id", articleId);

    const result = await ImageApi.upload(formData);
    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return null;
    }

    return result.unwrap() as Image;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        if (!articleId) {
          return;
        }

        const image = await uploadImage(file, articleId);
        if (!image) {
          return;
        }

        setUploadedImages([...uploadedImages, image]);
        onImageUpload(image.name, image.url);
      }
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    const image = uploadedImages.find(image => image.id === imageId);
    if (!image) {
      return;
    }

    const result = await ImageApi.delete(imageId);
    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return;
    }

    setUploadedImages(uploadedImages.filter(image => image.id !== imageId));
    onDeleteImage(image.name, image.url);
  };

  return (
    <Stack spacing={2}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        sx={{ fontFamily: 'monospace' }}
      >
        Upload Images
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
      </Button>
      {uploadedImages.length > 0 && (
        <List dense>
          {uploadedImages.map((image) => (
            <ListItem
              key={image.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={image.name}
                sx={{ fontFamily: 'monospace' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Stack>
  );
}

export default ArticleImageUploader;
