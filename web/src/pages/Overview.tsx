import {
  ArrowRightOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { Link } from "react-router";

const features = [
  {
    icon: <FileTextOutlined />,
    title: "Все операции в одном месте",
    description:
      "Загружайте банковские операции и работайте с ними в едином понятном интерфейсе.",
  },
  {
    icon: <BarChartOutlined />,
    title: "Понятная картина финансов",
    description:
      "Следите за движением средств и быстрее находите важное среди повседневных операций.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Контроль данных",
    description:
      "Система проверяет импортируемые данные и сообщает о строках, требующих внимания.",
  },
];

export function OverView() {
  return (
    <main className="overview-page">
      <section className="overview-hero">
        <div className="overview-hero__glow" aria-hidden="true" />

        <div className="overview-hero__content">

          <Typography.Title className="overview-hero__title" level={1}>
            Финансы без лишнего шума
          </Typography.Title>

          <Typography.Paragraph className="overview-hero__description">
            Xeno помогает собрать банковские операции в одном месте, привести их
            к понятному виду и сосредоточиться на том, куда движутся ваши деньги.
          </Typography.Paragraph>

          <Space size={12} wrap>
            <Button type="primary" size="large">
              <Link to="/operations">
                Перейти к операциям <ArrowRightOutlined />
              </Link>
            </Button>
          </Space>
        </div>

        <div className="overview-hero__mark" aria-hidden="true">
          X
        </div>
      </section>

      <section className="overview-features" aria-labelledby="overview-features-title">
        <div className="overview-section-heading">
          <Typography.Title id="overview-features-title" level={2}>
            Что можно делать в системе
          </Typography.Title>
          <Typography.Text type="secondary">
            Основные возможности, с которых удобно начать знакомство с Xeno.
          </Typography.Text>
        </div>

        <Row gutter={[16, 16]}>
          {features.map((feature) => (
            <Col xs={24} md={8} key={feature.title}>
              <Card className="overview-feature-card hover-lift" bordered>
                <div className="overview-feature-card__icon">{feature.icon}</div>
                <Typography.Title level={4}>{feature.title}</Typography.Title>
                <Typography.Paragraph type="secondary">
                  {feature.description}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </main>
  );
}
