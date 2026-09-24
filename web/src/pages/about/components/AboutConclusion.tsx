import { Typography } from "antd";

export function AboutConclusion() {
  return (
    <section className="about-conclusion">
      <Typography.Text className="about-conclusion__label">Главная идея</Typography.Text>
      <Typography.Title level={2}>
        Не просто показать расходы, а помочь понять собственное финансовое поведение.
      </Typography.Title>
    </section>
  );
}
