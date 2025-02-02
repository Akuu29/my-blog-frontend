import Categories from "./side-bar/Category/Categories";
import Tags from "./side-bar/Tag/Tags";


function RightSideBar() {
  return (
    <div className="right-sidebar">
      <Categories />
      <Tags />
    </div>
  );
}

export default RightSideBar;
