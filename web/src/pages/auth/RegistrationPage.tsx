import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import { authQueryKeys, authService } from "../../api";
import type { LoginRequest } from "../../api";
import { queryClient } from "../../config/querryClient";
import { Link } from "react-router";

type RedirectState = {
  from?: {
    pathname: string;
    search: string;
    hash: string;
  };
};

type RegistrationFormValues = LoginRequest & {
  passwordConfirmation: string;
};
export function RegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const register = useMutation({
    mutationFn: authService.register,
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

      setErrorMessage(message ?? "Не удалось зарегистрироваться. Попробуйте ещё раз.");
    },
  });

  const handleSubmit = ({ login, password }: RegistrationFormValues) => {
    setErrorMessage(null);
    register.mutate({ login, password });
  };

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2}>Создать аккаунт</Typography.Title>
        <Typography.Paragraph type="secondary">
          Зарегистрируйтесь, чтобы начать вести учёт операций.
        </Typography.Paragraph>

        {errorMessage && (
          <Alert
            className="auth-card__error"
            type="error"
            showIcon
            message={errorMessage}
          />
        )}

        <Form<RegistrationFormValues>
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Логин"
            name="login"
            rules={[
              { required: true, message: "Укажите логин" },
              { whitespace: true, message: "Логин не может состоять только из пробелов" },
            ]}
          >
            <Input autoComplete="username" autoFocus />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: "Укажите пароль" },
              { min: 8, message: "Пароль должен содержать не менее 8 символов" },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Подтвердите пароль"
            name="passwordConfirmation"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Подтвердите пароль" },
              ({ getFieldValue }) => ({
                validator(_, value: string | undefined) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={register.isPending}
          >
            Зарегистрироваться
          </Button>
        </Form>
        <Typography.Paragraph className="text-center mt-2" type="secondary">
          Уже есть аккаунт? <Link to="/auth/login">Войдите.</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  );
}
