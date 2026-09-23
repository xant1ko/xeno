import { FileAddOutlined } from "@ant-design/icons";
import { Alert, Button, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import type { Operation } from "../../types";
import { useOperationsQuery } from "../../queries/useOperationsQuery";

const columns: TableColumnsType<Operation> = [
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
    render: (date: string) => new Date(date).toLocaleString("ru-RU"),
  },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Категория",
    dataIndex: "custom_category",
    key: "custom_category",
    render: (category: string, operation) =>
      category || operation.default_category,
  },
  {
    title: "Сумма",
    dataIndex: "transaction_amount",
    key: "transaction_amount",
    render: (amount: number, operation) =>
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: operation.currency,
      }).format(amount),
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
  },
];

export function OperationsView() {
  const operations = useOperationsQuery({ page: 1, limit: 50 });

  if (operations.isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не удалось загрузить операции"
        description="Попробуйте обновить страницу позже."
      />
    );
  }

  const items = operations.data?.items ?? [];
  const hasNoOperations = operations.isSuccess && items.length === 0;

  return (
    <section className="operations-view">
      {hasNoOperations ? (
        <div className="operations-empty">
          <div className="operations-empty__icon " aria-hidden="true">
            <FileAddOutlined />
          </div>

          <Typography.Title level={2}>
            Начните работу прямо сейчас
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            Добавьте первые операции, чтобы увидеть движение денег, категории и
            историю расходов в одном месте.
          </Typography.Paragraph>

          <Button type="primary" size="large" disabled >
            Импортировать CSV
          </Button>
          <Typography.Text className="operations-empty__hint" type="secondary">
            Импорт появится в ближайшем обновлении
          </Typography.Text>
        </div>
      ) : (
        <Table<Operation>
          rowKey="id"
          columns={columns}
          dataSource={items}
          loading={operations.isPending}
          pagination={false}
          scroll={{ x: true }}
        />
      )}
    </section>
  );
}
