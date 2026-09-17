
import { Logo } from "../AppLogo"
import { Navigation } from "./AppNavigationList"
import { Drawer, Layout } from "antd"

const { Sider } = Layout;


export function AppDrawer({
  isMobile = false,
  collapsed = false,
drawerOpen
}) {
  return (
    <>
    {!isMobile && (
      <Sider
        className="app-sider"
        collapsed={collapsed}
        collapsible
        trigger={null}
      >
        <Logo compact={collapsed} />
        <Navigation />
      </Sider>
    )}

    <Drawer
      className="app-drawer"
      placement="left"
      open={isMobile && drawerOpen}
      title={<Logo />}
      styles={{ body: { padding: 0 } }}
    >
      <Navigation  />
    </Drawer>
  </>
  )
}
