import logo from './logo.svg';
import './App.css';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import CreateContact from './create-contact';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Home';
import React from 'react';
import { Provider } from 'react-redux'
import { store } from './redux/store';
import Login from './Login';
import { ProtectedRoute } from './ProtectedRoute';

function App() {
  const routesForPublic = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home",
          element: <Home />,
        }, {
          path: "/create",
          element: <CreateContact />,
        }, {
          path: "/edit",
          element: <CreateContact />,
        },
      ],
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForAuthenticatedOnly,

  ]);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
