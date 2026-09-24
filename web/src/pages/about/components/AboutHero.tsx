import { ArrowRightOutlined, BulbOutlined } from "@ant-design/icons";
import { Button, Tag, Typography } from "antd";
import { Link } from "react-router";

export function AboutHero() {
  return (
    <section className="about-hero">
      <div className="about-hero__glow" aria-hidden="true" />
      <div className="about-hero__content">
        <Tag className="about-eyebrow" bordered={false}>О сервисе</Tag>
        <Typography.Title className="about-hero__title" level={1}>
          Финансовая картина, а не набор банковских приложений
        </Typography.Title>
        <Typography.Paragraph className="about-hero__description">
          Xeno объединяет личные финансы, превращая разрозненные операции в
          понятную историю, аналитику и инструмент для работы с привычками.
        </Typography.Paragraph>
        <Button className="about-hero__action" type="primary" size="large">
          <Link to="/operations">
            Перейти к аналитике <ArrowRightOutlined />
          </Link>
        </Button>
      </div>
      <div className="about-hero__question">
        <BulbOutlined />
        <span>Что происходит с моими деньгами?</span>
      </div>
    </section>
  );
}
