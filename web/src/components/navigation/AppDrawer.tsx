
import { Logo } from "../AppLogo"
import { Navigation } from "./AppNavigationList"
import { Drawer, Layout } from "antd"

const { Sider } = Layout;


export function AppDrawer({
  isMobile = false,
  collapsed = false,

}) {
  return (
    <>
    {!isMobile && (
      <Sider
        className="app-sider"
        width={208}
        collapsedWidth={65}
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
      width={280}
      open={isMobile && drawerOpen}
      onClose={() => setDrawerOpen(false)}
      title={<Logo />}
      styles={{ body: { padding: 0 } }}
    >
      <Navigation onSelect={() => setDrawerOpen(false)} />
    </Drawer>
  </>
  )
}
