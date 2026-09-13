import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    // ─────────────────────────────
    // BRAND
    // ─────────────────────────────

    colorPrimary: "#A855F7",
    colorInfo: "#A855F7",

    // ─────────────────────────────
    // BACKGROUND
    // ─────────────────────────────

    colorBgBase: "#0A080F",
    colorBgLayout: "#0A080F",
    colorBgContainer: "#110D17",
    colorBgElevated: "#181220",
    colorBgSpotlight: "#21172C",

    // ─────────────────────────────
    // TEXT
    // ─────────────────────────────

    colorText: "#F5F0FA",
    colorTextSecondary: "#B9AFC2",
    colorTextTertiary: "#82758D",
    colorTextQuaternary: "#5D5266",

    // ─────────────────────────────
    // BORDER
    // ─────────────────────────────

    colorBorder: "#30243A",
    colorBorderSecondary: "#211A28",

    // ─────────────────────────────
    // STATUS
    // ─────────────────────────────

    colorSuccess: "#4ADE80",
    colorWarning: "#FACC15",
    colorError: "#F43F5E",

    // ─────────────────────────────
    // SIZING
    // ─────────────────────────────

    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,

    controlHeight: 38,
    controlHeightSM: 30,
    controlHeightLG: 44,

    fontSize: 14,
  },

  components: {
    Button: {
      colorPrimary: "#A855F7",
      colorPrimaryHover: "#C084FC",
      colorPrimaryActive: "#9333EA",
      colorPrimaryBg: "#21132E",
      colorPrimaryBgHover: "#2B183B",
      borderRadius: 8,
    },
    Input: {
      colorBgContainer: "#110D17",
      colorBorder: "#30243A",
      hoverBorderColor: "#8B5CF6",
      activeBorderColor: "#A855F7",
      activeShadow: "0 0 0 2px rgba(168, 85, 247, 0.15)",
    },
    Select: {
      colorBgContainer: "#110D17",
      colorBorder: "#30243A",
      optionSelectedBg: "#291637",
      optionActiveBg: "#21132E",
      optionSelectedColor: "#D8B4FE",
      hoverBorderColor: "#8B5CF6",
      activeBorderColor: "#A855F7",
    },
    Table: {
      colorBgContainer: "#110D17",
      headerBg: "#181220",
      headerColor: "#F5F0FA",
      rowHoverBg: "#1B1424",
      borderColor: "#30243A",
      headerSplitColor: "#30243A",
    },
    Card: {
      colorBgContainer: "#110D17",
      colorBorderSecondary: "#30243A",
      borderRadiusLG: 12,
    },
    Modal: {
      contentBg: "#110D17",
      headerBg: "#110D17",
      footerBg: "#110D17",
      titleColor: "#F5F0FA",
    },
    Menu: {
      itemBg: "transparent",
      itemHoverBg: "#181220",
      itemSelectedBg: "#291637",
      itemSelectedColor: "#C084FC",
      itemColor: "#B9AFC2",
      itemHoverColor: "#F5F0FA",
      darkItemBg: "transparent",
      darkSubMenuItemBg: "#110D17",
      darkItemSelectedBg: "#291637",
      darkItemSelectedColor: "#C084FC",
      darkItemColor: "#B9AFC2",
      darkItemHoverColor: "#F5F0FA",
    },
    Tabs: {
      itemColor: "#82758D",
      itemHoverColor: "#C084FC",
      itemSelectedColor: "#C084FC",
      inkBarColor: "#A855F7",
    },
    Tag: {
      defaultBg: "#21182C",
      defaultColor: "#C084FC",
    },
    Checkbox: {
      colorPrimary: "#A855F7",
      colorPrimaryHover: "#C084FC",
    },
    Radio: {
      colorPrimary: "#A855F7",
      colorPrimaryHover: "#C084FC",
    },
    Layout: {
      colorPrimary: "#A855F7",
      colorPrimaryHover: "#C084FC",
      bodyBg: "#0A080F",
      headerBg: "#110D17",
      footerBg: "#0A080F",
      siderBg: "#0A080F",
    },
    Switch: {
      colorPrimary: "#A855F7",
      colorPrimaryHover: "#C084FC",
    },

    Pagination: {
      itemActiveBg: "#291637",
      itemActiveColor: "#C084FC",
    },
  },
};
