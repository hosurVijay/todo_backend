import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { status: isLoggedIn, userData } = useSelector((state) => state.auth);

  return (
    <header className="shadow-md bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Todo App
          </Link>
          {isLoggedIn && (
            <span className="text-sm text-gray-600">
              Hi, {userData?.username}
            </span>
          )}
        </div>

        {isLoggedIn && (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow border rounded px-3 py-1"
              />
              <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link
                to="/add-todo"
                className="text-gray-700 hover:text-blue-600"
              >
                Add Todo
              </Link>
              <Link
                to="/all-todo"
                className="text-gray-700 hover:text-blue-600"
              >
                All Todos
              </Link>
              <Link to="/logout" className="text-gray-700 hover:text-red-600">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/signup" className="text-gray-700 hover:text-blue-600">
                Sign Up
              </Link>
            </>
          )}
          <Link to="/contact-us" className="text-gray-700 hover:text-blue-600">
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
