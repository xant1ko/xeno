import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Space, type MenuProps } from "antd";

const { Header } = Layout;

const accountItems: MenuProps["items"] = [
  { key: "profile", icon: <UserOutlined />, label: "Профиль" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "Выйти", danger: true },
];


// const toggleNavigation = () => {
//   if (isMobile) {
//     setDrawerOpen((open) => !open);
//     return;
//   }
//   setCollapsed((value) => !value);
// };
import axios from "axios";

axios.get('3000/operations/awdaw')

export function AppHeader() {
  return (
    <>
      <Header className="app-header">
        <Dropdown menu={{ items: accountItems }} placement="bottomRight">
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
    </>
  );
}
