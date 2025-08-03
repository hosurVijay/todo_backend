import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 mt-10 py-6 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-center md:text-left mb-4 md:mb-0">
          © {new Date().getFullYear()} TODO App. All rights reserved.
        </div>
        <div className="flex gap-4 text-sm">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/contact-us" className="hover:text-blue-600">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
