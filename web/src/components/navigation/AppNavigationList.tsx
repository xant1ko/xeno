import { Menu } from "antd";
import { routes } from "../../const/routes";
import { Link } from "react-router";

const navItems = routes.map((route) => {
  return {
    label: <Link to={route.path}>{route.label}</Link>
  }
})

export function Navigation({ onSelect }: { onSelect?: () => void }) {
  return (
    <Menu
      className="app-navigation"
      mode="inline"
      theme="dark"
      defaultSelectedKeys={["overview"]}
      items={navItems}
      onSelect={onSelect}
    />
  );
}
