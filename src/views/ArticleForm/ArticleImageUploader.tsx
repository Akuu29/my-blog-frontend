import { useState, useContext, MouseEvent } from 'react';
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ImageIcon from "@mui/icons-material/Image";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import handleError from "../../utils/handle-error";
import { ErrorSnackbarContext } from "../../contexts/ErrorSnackbarContext";
import { imageApi } from "../../services/image-api";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const uploadImage = async (file: File, articleId: string): Promise<Image | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("articleId", articleId);

    const result = await imageApi.upload(formData);
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

  const handleDeleteImage = async (imageId: string) => {
    const image = uploadedImages.find(image => image.id === imageId);
    if (!image) {
      return;
    }

    const result = await imageApi.delete(imageId);
    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return;
    }

    setUploadedImages(uploadedImages.filter(image => image.id !== imageId));
    onDeleteImage(image.name, image.url);
  };

  const handleOpenPopover = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        sx={{ fontFamily: 'monospace' }}
      >
        Upload Image
        <input
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
      </Button>
      <Badge badgeContent={uploadedImages.length} color="primary">
        <IconButton onClick={handleOpenPopover} sx={{ padding: '2px' }}>
          <ImageIcon />
        </IconButton>
      </Badge>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 1, minWidth: 240 }}>
          {uploadedImages.length === 0 ? (
            <Box sx={{ px: 1, py: 0.5, fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
              No images uploaded
            </Box>
          ) : (
            <List dense disablePadding>
              {uploadedImages.map((image) => (
                <ListItem
                  key={image.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteImage(image.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ImageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={image.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </Stack>
  );
}

export default ArticleImageUploader;
