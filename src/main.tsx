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
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
    ],
  },
]);

export default App;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <Toaster />

      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
);
