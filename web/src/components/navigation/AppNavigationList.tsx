import { Menu } from "antd";
import { Link, useLocation } from "react-router";
import { routes } from "../../router";

export function Navigation({ onSelect }: { onSelect?: () => void }) {
  const { pathname } = useLocation();

  const navItems = routes.map((route) => ({
    key: route.path,
    icon: route.icon,
    label: <Link to={route.path}>{route.label}</Link>,
  }));

  return (
    <Menu
      className="app-navigation"
      mode="inline"
      theme="dark"
      items={navItems}
      selectedKeys={[pathname]}
      onSelect={onSelect}
    />
  );
}
