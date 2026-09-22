import { Grid, Layout } from "antd";
import { Outlet } from "react-router";
import { AppDrawer, AppHeader } from "../components/navigation";

export function AppLayout() {
  const { Content } = Layout;
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Layout className="app-shell">
      <AppDrawer
        isMobile={isMobile}
        collapsed={false}
        drawerOpen={false}
      />

      <Layout className="app-main">
        <AppHeader />

        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
