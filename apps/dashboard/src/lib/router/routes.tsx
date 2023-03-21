import type { PathRouteProps } from "react-router-dom";

import Home from "lib/pages/home";
import Movies from "lib/pages/movies";

export const routes: Array<PathRouteProps> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/movies",
    element: <Movies />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [];
