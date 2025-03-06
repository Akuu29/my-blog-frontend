import LongMenu from "../../components/layout/LongMenu";

const OPTIONS = [
  "Delete",
  "Edit",
];

const DELETE_CONFIRM_MESSAGE = "Are you sure you want to delete this article?";

type ArticleAdminMenuProps = {
  deleteArticle: () => void;
  editArticle: () => void;
}

function ArticleAdminMenu({ deleteArticle, editArticle }: ArticleAdminMenuProps) {
  const handleClickMenuItem = (option: string) => {
    switch (option) {
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
    <LongMenu options={OPTIONS} clickMenuItemHandler={handleClickMenuItem} />
  );
}

export default ArticleAdminMenu;
