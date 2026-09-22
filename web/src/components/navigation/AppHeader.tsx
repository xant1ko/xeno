import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Space, type MenuProps } from "antd";
import { useNavigate } from "react-router";
import { authQueryKeys, authService } from "../../api";
import { queryClient } from "../../config/querryClient";
import { useAuthStore } from "../../stores/auth.store";

const { Header } = Layout;

const accountItems: MenuProps["items"] = [
  { key: "profile", icon: <UserOutlined />, label: "Профиль" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "Выйти", danger: true },
];

export function AppHeader() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleAccountClick: MenuProps["onClick"] = async ({ key }) => {
    if (key !== "logout") {
      return;
    }

    try {
      await authService.logout();
    } finally {
      queryClient.removeQueries({ queryKey: authQueryKeys.me });
      navigate("/login", { replace: true });
    }
  };

  return (
    <Header className="app-header">
      <Dropdown
        menu={{ items: accountItems, onClick: handleAccountClick }}
        placement="bottomRight"
      >
        <Button className="account-button" type="text">
          <Space size={10}>
            <Avatar size={32} icon={<UserOutlined />} />
            <span className="account-button__details">
              <span className="account-button__name">
                {user?.login ?? "Профиль"}
              </span>
              <span className="account-button__role">Пользователь</span>
            </span>
          </Space>
        </Button>
      </Dropdown>
    </Header>
  );
}
