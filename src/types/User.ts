export interface User {
  name?: string;
  email: string;
  password: string;
}


// import { Navigate, useLocation } from "react-router";

// const location = useLocation();

// const handleBuy = () => {
//   if (!user) {
//     navigate("/login", {
//       state: { from: location },
//     });
//     return;
//   }

//   navigate("/checkout");
// };