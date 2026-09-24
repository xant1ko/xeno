import {
  CloudUploadOutlined,
  FolderOpenOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";

const capabilities = [
  { icon: <CloudUploadOutlined />, title: "Единая финансовая история", description: "Собирайте операции из банков, карт и файлов в одном месте." },
  { icon: <FolderOpenOutlined />, title: "Категории под ваш стиль жизни", description: "Разделяйте доходы и расходы, создавайте собственные категории." },
  { icon: <PieChartOutlined />, title: "Аналитика без шума", description: "Сравнивайте периоды и замечайте изменения в финансовых привычках." },
];

export function AboutPurposeSection() {
  return (
    <section className="about-section" aria-labelledby="about-purpose-title">
      <div className="about-section__heading">
        <Tag className="about-section__tag" bordered={false}>Зачем</Tag>
        <Typography.Title id="about-purpose-title" level={2}>
          Один контекст вместо отдельных фрагментов
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Деньги могут быть распределены между картами, счетами и банками.
          Каждый из них показывает лишь свою часть истории. Xeno собирает данные
          в единый контекст, чтобы принимать решения было проще.
        </Typography.Paragraph>
      </div>
      <Row gutter={[16, 16]}>
        {capabilities.map((capability) => (
          <Col xs={24} md={8} key={capability.title}>
            <Card className="about-capability hover-lift" bordered>
              <div className="about-capability__icon">{capability.icon}</div>
              <Typography.Title level={4}>{capability.title}</Typography.Title>
              <Typography.Paragraph type="secondary">
                {capability.description}
              </Typography.Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
