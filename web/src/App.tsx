import { useState } from "react";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Grid,
  Layout,
  Space,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import { AppDrawer } from "./components/navigation/AppDrawer";
import { Logo } from "./components/AppLogo";

const accountItems: MenuProps["items"] = [
  { key: "profile", icon: <UserOutlined />, label: "Профиль" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "Выйти", danger: true },
];




function App() {
  const { Content, Header } = Layout;
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
      <AppDrawer isMobile={isMobile} collapsed={collapsed} drawerOpen={drawerOpen} />

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

          <Dropdown menu={{ items: accountItems }} placement="bottomRight" >
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
