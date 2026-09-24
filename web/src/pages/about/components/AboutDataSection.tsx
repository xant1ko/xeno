import {
  ApiOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Row, Tag, Typography } from "antd";

export function AboutDataSection() {
  return (
    <>
      <Divider className="about-divider" />
      <section className="about-section" aria-labelledby="about-data-title">
        <div className="about-section__heading">
          <Tag className="about-section__tag" bordered={false}>Данные</Tag>
          <Typography.Title id="about-data-title" level={2}>
            Два способа собрать историю
          </Typography.Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card className="about-mode" bordered>
              <div className="about-mode__number">01</div>
              <CloudUploadOutlined className="about-mode__icon" />
              <Typography.Title level={3}>Импорт данных</Typography.Title>
              <Typography.Paragraph type="secondary">
                Загрузите таблицу с операциями. Сервис нормализует строки и
                добавит их в вашу финансовую историю — без интеграции с банком.
              </Typography.Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="about-mode" bordered>
              <div className="about-mode__number">02</div>
              <ApiOutlined className="about-mode__icon" />
              <Typography.Title level={3}>Автосинхронизация</Typography.Title>
              <Typography.Paragraph type="secondary">
                Подключите поддерживаемый банк, и новые операции будут
                автоматически появляться в общей истории.
              </Typography.Paragraph>
            </Card>
          </Col>
        </Row>
        <div className="about-flow" aria-label="Путь финансовых данных">
          <div className="about-flow__item"><CloudUploadOutlined /><span>Банки и импорт</span></div>
          <span className="about-flow__line" aria-hidden="true" />
          <div className="about-flow__item"><CheckCircleOutlined /><span>Нормализация</span></div>
          <span className="about-flow__line" aria-hidden="true" />
          <div className="about-flow__item"><FolderOpenOutlined /><span>Категоризация</span></div>
          <span className="about-flow__line" aria-hidden="true" />
          <div className="about-flow__item about-flow__item--accent"><BarChartOutlined /><span>Понятная аналитика</span></div>
        </div>
      </section>
    </>
  );
}
