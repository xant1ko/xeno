import { SwapOutlined } from "@ant-design/icons";

import { OperationsView } from "../pages/operations/OperationsView";

export const routes = [
  {
    key: "operations",
    path: "/operations",
    label: "Операции",
    element: <OperationsView />,
    icon: <SwapOutlined />,
  },
];
