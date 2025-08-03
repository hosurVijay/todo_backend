import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";

import AuthLayout from "./components/AuthLayout.jsx";
import LoginUser from "./Pages/LoginUser.jsx";
import SignUpUser from "./Pages/SignUpUser.jsx";
import Home from "./Pages/Home.jsx";
import AddTodo from "./Pages/AddTodo.jsx";
import AllTodo from "./Pages/AllTodo.jsx";
import Contact from "./Pages/ContactUs.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginUser />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignUpUser />
          </AuthLayout>
        ),
      },
      {
        path: "/add-todo",
        element: (
          <AuthLayout authentication={true}>
            <AddTodo />
          </AuthLayout>
        ),
      },
      {
        path: "/all-todo",
        element: (
          <AuthLayout authentication={true}>
            <AllTodo />
          </AuthLayout>
        ),
      },
      {
        path: "/contact-us",
        element: <Contact />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
