import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { authQueryKeys, authService } from "../../api";
import type { LoginRequest } from "../../api";
import { queryClient } from "../../config/querryClient";

type RedirectState = {
  from?: {
    pathname: string;
    search: string;
    hash: string;
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (auth) => {
      queryClient.setQueryData(authQueryKeys.me, auth.user);

      const from = (location.state as RedirectState | null)?.from;
      const destination = from
        ? `${from.pathname}${from.search}${from.hash}`
        : "/operations";

      navigate(destination, { replace: true });
    },
    onError: (error) => {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data.message
        : undefined;

      setErrorMessage(message ?? "Не удалось выполнить вход. Попробуйте ещё раз.");
    },
  });

  const handleSubmit = (values: LoginRequest) => {
    setErrorMessage(null);
    login.mutate(values);
  };

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2}>Вход в Xeno</Typography.Title>
        <Typography.Paragraph type="secondary">
          Введите логин и пароль, чтобы продолжить.
        </Typography.Paragraph>

        {errorMessage && (
          <Alert
            className="auth-card__error"
            type="error"
            showIcon
            message={errorMessage}
          />
        )}

        <Form<LoginRequest>
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: "Укажите логин" }]}
          >
            <Input autoComplete="username" autoFocus />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Укажите пароль" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={login.isPending}
          >
            Войти
          </Button>
        </Form>
      </Card>
    </main>
  );
}
