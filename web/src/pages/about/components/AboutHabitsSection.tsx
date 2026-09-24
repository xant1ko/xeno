import { FlagOutlined } from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";

export function AboutHabitsSection() {
  return (
    <section className="about-habits" aria-labelledby="about-habits-title">
      <div>
        <Tag className="about-section__tag" bordered={false}>Привычки</Tag>
        <Typography.Title id="about-habits-title" level={2}>
          Видеть не только факт, но и соответствие цели
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Отмечайте категории, в которых хотите сократить расходы, установить
          лимит или, наоборот, поддерживать важные для себя траты.
        </Typography.Paragraph>
      </div>
      <Card className="about-goal-card" bordered>
        <div className="about-goal-card__header"><span>Доставка еды</span><FlagOutlined /></div>
        <div className="about-goal-card__row"><span>Цель</span><strong>Сократить расходы</strong></div>
        <div className="about-goal-card__row"><span>Лимит</span><strong>5 000 ₽ / месяц</strong></div>
        <div className="about-goal-card__row"><span>Потрачено</span><strong>7 350 ₽</strong></div>
        <div className="about-goal-card__result">Превышение · +2 350 ₽</div>
      </Card>
    </section>
  );
}
