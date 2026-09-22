import {
  DashboardOutlined,
  SwapOutlined,
} from "@ant-design/icons";

import { OperationsView } from "../pages/operations/OperationsView";
import { OverView } from "../pages/Overview";

export const routes = [
  {
    key: "overview",
    path: "/",
    label: "Обзор",
    element: <OverView />,
    icon: <DashboardOutlined />,
  },
  {
    key: "operations",
    path: "/operations",
    label: "Операции",
    element: <OperationsView />,
    icon: <SwapOutlined />,
  },
];