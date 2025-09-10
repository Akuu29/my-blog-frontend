import LongMenu from "../../LongMenu";

const OPTIONS = [
  "Delete",
];

const DELETE_CONFIRM_MESSAGE = `Deleted tags are also deleted from the associated articles.
Are you sure you want to delete it?`;

type TagAdminMenuProps = {
  deleteTag: () => void;
  showAdminMenu?: boolean;
};

function TagAdminMenu({ deleteTag, showAdminMenu }: TagAdminMenuProps) {
  const handleClickMenuItem = (option: string) => {
    switch (option) {
      case "Delete":
        if (window.confirm(DELETE_CONFIRM_MESSAGE)) {
          deleteTag();
        }
        break;
      default:
        break;
    }
  };

  return (
    showAdminMenu && (
      <LongMenu options={OPTIONS} clickMenuItemHandler={handleClickMenuItem} />
    )
  );
}

export default TagAdminMenu;
