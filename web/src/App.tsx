import { useState } from "react";
import {
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Space,
  Typography,
} from "antd";
import type { MenuProps } from "antd";

const navigationItems: MenuProps["items"] = [
  { key: "overview", icon: <AppstoreOutlined />, label: "Обзор" },
  { key: "import", icon: <UploadOutlined />, label: "Импорт операций" },
  { key: "settings", icon: <SettingOutlined />, label: "Настройки" },
];

const accountItems: MenuProps["items"] = [
  { key: "profile", icon: <UserOutlined />, label: "Профиль" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "Выйти", danger: true },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`app-logo${compact ? " app-logo--compact" : ""}`}>
      <span className="app-logo__mark" aria-hidden="true">X</span>
      {!compact && <span className="app-logo__name">Xeno</span>}
    </div>
  );
}

function Navigation({ onSelect }: { onSelect?: () => void }) {
  return (
    <Menu
      className="app-navigation"
      mode="inline"
      theme="dark"
      defaultSelectedKeys={["overview"]}
      items={navigationItems}
      onSelect={onSelect}
    />
  );
}

function App() {
  const { Content, Header, Sider } = Layout;
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleNavigation = () => {
    if (isMobile) {
      setDrawerOpen((open) => !open);
      return;
    }
    setCollapsed((value) => !value);
  };

  return (
    <Layout className="app-shell">
      {!isMobile && (
        <Sider
          className="app-sider"
          width={208}
          collapsedWidth={76}
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

      <Layout className="app-main">
        <Header className="app-header">
          <Button
            className="app-navigation-toggle"
            type="text"
            icon={isMobile || collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleNavigation}
            aria-label={isMobile || collapsed ? "Открыть навигацию" : "Закрыть навигацию"}
          />

          {isMobile && <Logo />}

          <Dropdown menu={{ items: accountItems }} placement="bottomRight" arrow>
            <Button className="account-button" type="text">
              <Space size={10}>
                <Avatar size={32} icon={<UserOutlined />} />
                <span className="account-button__details">
                  <span className="account-button__name">Алексей</span>
                  <span className="account-button__role">Пользователь</span>
                </span>
              </Space>
            </Button>
          </Dropdown>
        </Header>

        <Content className="app-content">
          <div className="content-heading">
            <Typography.Title level={2}>Обзор</Typography.Title>
            <Typography.Text type="secondary">Добро пожаловать в Xeno</Typography.Text>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
