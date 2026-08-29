import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import Loading from "./Components/Loading";
import { Toaster } from "sonner";
import Shop from "./pages/Shop";
import Collections from "./pages/Collections";
import LoginForm from "./Components/Form/LoginForm";
import RegisterForm from "./Components/Form/RegisterForm";
import AboutUs from "./pages/AboutUs";
import Blog from "./Components/Blog";
import Contact from "./pages/Contact";
import ContextProvider from "../src/ContextProvider";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/shop/:id",
        element: <ProductDetails />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
]);

export default App;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider>
      <Suspense fallback={<Loading />}>
        <Toaster/>

        <RouterProvider router={router} />
      </Suspense>
    </ContextProvider>
  </StrictMode>,
);
