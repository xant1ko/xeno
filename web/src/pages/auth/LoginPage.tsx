import { Card, Typography } from "antd";

export function LoginPage() {
  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2}>Вход в Xeno</Typography.Title>
        <Typography.Paragraph type="secondary">
          Форма авторизации будет добавлена следующим этапом.
        </Typography.Paragraph>
      </Card>
    </main>
  );
}
