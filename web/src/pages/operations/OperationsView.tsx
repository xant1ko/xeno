import { FileAddOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useState } from "react";
import type { Operation } from "../../types";
import { useOperationsQuery } from "../../queries/useOperationsQuery";
import { ImportOperationsModal } from "./components/ImportOperationsModal";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const operations = useOperationsQuery({ page, limit: pageSize });

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    // При смене размера страницы начинаем с начала, иначе пользователь может попасть на пустую страницу.
    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize);
      setPage(1);
      return;
    }
    setPage(nextPage);
  };

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
  // Пустой экран показываем только для действительно пустого списка, а не для ещё не загруженной страницы.
  const hasNoOperations = operations.isSuccess && (operations.data?.total ?? 0) === 0;

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

          <Button
            type="primary"
            size="large"
            onClick={() => setIsImportModalOpen(true)}
          >
            Импортировать CSV
          </Button>
        </div>
      ) : (
        <div>
          <div className="operations-view__toolbar">
            <Typography.Title level={1}>Операции</Typography.Title>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Импортировать CSV
            </Button>
          </div>
        <Table<Operation>
          rowKey="id"
          columns={columns}
          dataSource={items}
          // isFetching сохраняет спиннер и при переходе между уже закешированными страницами.
          loading={operations.isFetching}
          pagination={{
            current: page,
            pageSize,
            total: operations.data?.total ?? 0,
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50, 100],
            showTotal: (total) => `Всего операций: ${total}`,
            onChange: handlePageChange,
          }}
          scroll={{ x: false }}
        />
        </div>
      )}

      <ImportOperationsModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImported={() => setPage(1)}
      />
    </section>
  );
}
