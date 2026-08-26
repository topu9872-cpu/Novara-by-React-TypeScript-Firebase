import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import Loading from "./Components/Loading";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <Home />,
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
