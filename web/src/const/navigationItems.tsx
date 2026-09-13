import { AppstoreOutlined, SettingOutlined, UploadOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

export const navigationItems: MenuProps["items"] = [
  { key: "overview", icon: <AppstoreOutlined />, label: "Обзор" },
  { key: "import", icon: <UploadOutlined />, label: "Импорт операций" },
  { key: "settings", icon: <SettingOutlined />, label: "Настройки" },
];
