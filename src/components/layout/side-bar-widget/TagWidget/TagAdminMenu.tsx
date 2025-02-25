import LongMenu from "../../LongMenu";

const OPTIONS = [
  "Delete",
];

const DELETE_CONFIRM_MESSAGE = `Deleted tags are also deleted from the associated articles.
Are you sure you want to delete it?`;

function TagAdminMenu({ deleteTag }: { deleteTag: () => void }) {
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
    <LongMenu options={OPTIONS} clickMenuItemHandler={handleClickMenuItem} />
  );
}

export default TagAdminMenu;
