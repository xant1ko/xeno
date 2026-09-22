import { useState } from "react";
import { Grid,Layout} from "antd";
import { AppDrawer, AppHeader } from "./components/navigation";
import { BrowserRouter, Routes, Route, routes } from "./router";

function App() {
  const { Content } = Layout;
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);


  return (
          <BrowserRouter>
    <Layout className="app-shell">
      <AppDrawer
        isMobile={isMobile}
        collapsed={collapsed}
        drawerOpen={drawerOpen}
      />

      <Layout className="app-main">
        <AppHeader/>

        <Content className="app-content">
            <Routes>
              {routes.map((route) => {
                return <>
                  <Route  path={route.path} element={route.element} />
                </>;
              })}
            </Routes>
        </Content>
      </Layout>
    </Layout>
          </BrowserRouter>
  );
}

export default App;
