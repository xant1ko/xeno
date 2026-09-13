import { Menu } from "antd";
import { navigationItems } from "../../const/navigationItems";

export function Navigation({ onSelect }: { onSelect?: () => void }) {
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
