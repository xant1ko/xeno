import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RequireAuth } from "./router/RequireAuth";
import { routes } from "./router/routes";
import { OverView } from "./pages/Overview";
import { RootGuard } from "./utils/redirectUtils";


function App() {
  return (
    <BrowserRouter>
      <RootGuard/>
      <Routes>

        <Route
          path='/overview'
          element=<OverView />
        />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            {routes.map((route) => (
              <Route
                key={route.key}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
