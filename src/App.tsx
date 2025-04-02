
import React, { Suspense } from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import { routes } from './App.routes';

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-teal"></div>
    </div>}>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;
