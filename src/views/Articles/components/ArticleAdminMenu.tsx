import LongMenu from "../../../components/layout/LongMenu";
import type { ArticleStatus } from "../../../types/article";

const DELETE_CONFIRM_MESSAGE = "Are you sure you want to delete this article?";

const getOptions = (status: ArticleStatus) => [
  status === "published" ? "Unpublish" : "Publish",
  "Edit",
  "Delete",
];

type ArticleAdminMenuProps = {
  articleStatus: ArticleStatus;
  deleteArticle: () => void;
  editArticle: () => void;
  changeStatus: (status: ArticleStatus) => void;
}

function ArticleAdminMenu({ articleStatus, deleteArticle, editArticle, changeStatus }: ArticleAdminMenuProps) {
  const handleClickMenuItem = (option: string) => {
    switch (option) {
      case "Publish":
        changeStatus("published");
        break;
      case "Unpublish":
        changeStatus("private");
        break;
      case "Delete":
        if (window.confirm(DELETE_CONFIRM_MESSAGE)) {
          deleteArticle();
        }
        break;
      case "Edit":
        editArticle();
        break;
      default:
        break;
    }
  };

  return (
    <LongMenu options={getOptions(articleStatus)} clickMenuItemHandler={handleClickMenuItem} />
  );
}

export default ArticleAdminMenu;
