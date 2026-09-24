import { RobotOutlined, SendOutlined } from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";

const channels = [
  { icon: <RobotOutlined />, title: "AI-ассистент", description: "Отвечает на вопросы о расходах и помогает заметить тенденции." },
  { icon: <SendOutlined />, title: "Telegram-бот", description: "Присылает уведомления и помогает категоризировать операции в чате." },
];

export function AboutFutureSection() {
  return (
    <section className="about-section" aria-labelledby="about-future-title">
      <div className="about-section__heading">
        <Tag className="about-section__tag" bordered={false}>В перспективе</Tag>
        <Typography.Title id="about-future-title" level={2}>
          Данные там, где с ними удобно работать
        </Typography.Title>
      </div>
      <Row gutter={[16, 16]}>
        {channels.map((channel) => (
          <Col xs={24} md={12} key={channel.title}>
            <Card className="about-channel hover-lift" bordered>
              <div className="about-channel__icon">{channel.icon}</div>
              <div>
                <Typography.Title level={4}>{channel.title}</Typography.Title>
                <Typography.Paragraph type="secondary">{channel.description}</Typography.Paragraph>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
