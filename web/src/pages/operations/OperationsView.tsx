import { Alert, Table, Typography } from "antd";
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

  return (
    <section>
      <Typography.Title level={1}>Операции</Typography.Title>

      <Table<Operation>
        rowKey="id"
        columns={columns}
        dataSource={operations.data?.items}
        loading={operations.isPending}
        pagination={false}
        scroll={{ x: true }}
      />
    </section>
  );
}
