import Input from "../../atoms/form/Input";
import { IoIosNotifications } from "react-icons/io";

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-black">
        Hi, Azka! Welcome back🙌🏻
      </h1>
      <div className="flex items-center space-x-2">
        <Input type="text" placeholder="Search..." id="search" name="search" />
        <button className="bg-white border border-gray-200 p-2 rounded text-black">
          <IoIosNotifications />
        </button>
      </div>
    </header>
  );
};

export default Header;
