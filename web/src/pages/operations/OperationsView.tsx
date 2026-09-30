import { FileAddOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router";
import type { Operation, OperationType } from "../../types";
import { useOperationsQuery } from "../../queries/useOperationsQuery";
import { ImportOperationsModal } from "./components/ImportOperationsModal";
import { OperationTypeFilter } from "./components/OperationTypeFilter";

const columns: TableColumnsType<Operation> = [
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
    width: 100,
    render: (date: string) => new Date(date).toLocaleString("ru-RU"),
  },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
    width: 320,
  },
  {
    title: "Категория",
    dataIndex: "custom_category",
    key: "custom_category",
    width: 200,
    render: (category: string, operation) =>
      category || operation.default_category,
  },
  {
    title: "Сумма",
    dataIndex: "transaction_amount",
    key: "transaction_amount",
    width: 160,
    render: (amount: number, operation) =>
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: operation.currency,
      }).format(amount),
  },
];

const defaultPage = 1;
const defaultPageSize = 10;
const pageSizeOptions = [10, 25, 50, 100];

function readPositiveInteger(value: string | null, fallback: number): number {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

function readOperationType(value: string | null): OperationType {
  return value === "income" || value === "expense" ? value : "all";
}

export function OperationsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const page = readPositiveInteger(searchParams.get("page"), defaultPage);
  const pageSize = readPositiveInteger(
    searchParams.get("limit"),
    defaultPageSize,
  );
  const operationType = readOperationType(searchParams.get("type"));
  const operations = useOperationsQuery({
    page,
    limit: pageSize,
    ...(operationType !== "all" && { type: operationType }),
  });

  const handleOperationTypeChange = (nextType: OperationType) => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set("page", String(defaultPage));

      if (nextType === "all") {
        nextSearchParams.delete("type");
      } else {
        nextSearchParams.set("type", nextType);
      }

      return nextSearchParams;
    });
  };

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      const isPageSizeChanged = nextPageSize !== pageSize;
      nextSearchParams.set("page", String(isPageSizeChanged ? defaultPage : nextPage));
      nextSearchParams.set("limit", String(nextPageSize));

      return nextSearchParams;
    });
  };

  const resetToFirstPage = () => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set("page", String(defaultPage));
      return nextSearchParams;
    });
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
  const hasNoOperations = operations.isSuccess && (operations.data?.total ?? 0) === 0;

  return (
    <section className="operations-view data-grid-page">
      <div className="operations-view__toolbar">
          <OperationTypeFilter
            value={operationType}
            onChange={handleOperationTypeChange}
          />
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setIsImportModalOpen(true)}
          >
            Импортировать CSV
          </Button>
      </div>

      {hasNoOperations ? (
        <div className="operations-empty">
          <div className="operations-empty__icon " aria-hidden="true">
            <FileAddOutlined />
          </div>

          <Typography.Title level={2}>
            {operationType === "all"
              ? "Начните работу прямо сейчас"
              : `Нет ${operationType === "income" ? "доходов" : "расходов"}`}
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            {operationType === "all"
              ? "Добавьте первые операции, чтобы увидеть движение денег, категории и историю расходов в одном месте."
              : "Попробуйте выбрать другой тип операции или импортировать новые данные."}
          </Typography.Paragraph>
        </div>
      ) : (
        <div className="operations-view__table data-grid-page__table">
          <Table<Operation>
            rowKey="id"
            columns={columns}
            dataSource={items}
            loading={operations.isFetching}
            pagination={{
              current: page,
              pageSize,
              total: operations.data?.total ?? 0,
              showSizeChanger: true,
              pageSizeOptions,
              showTotal: (total) => `Всего операций: ${total}`,
              onChange: handlePageChange,
            }}
            scroll={{ x: true }}
          />
        </div>
      )}

      <ImportOperationsModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImported={resetToFirstPage}
      />
    </section>
  );
}
