import { InboxOutlined } from "@ant-design/icons";
import { Alert, Button, Modal, Typography, Upload, message } from "antd";
import type { UploadFile } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useCsvImportMutation } from "../../../queries/useCsvImportMutation";

type ImportOperationsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ImportOperationsModal({
  open,
  onClose,
}: ImportOperationsModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const importCsv = useCsvImportMutation();
  const selectedFile = fileList[0]?.originFileObj;

  const errorMessage = isAxiosError<{ message?: string }>(importCsv.error)
    ? importCsv.error.response?.data.message
    : undefined;

  const handleClose = () => {
    setFileList([]);
    importCsv.reset();
    onClose();
  };

  const handleImport = () => {
    if (selectedFile) {
      importCsv.mutate(selectedFile);
    }
  };

  return (
    <Modal
      title="Импорт операций"
      open={open}
      onCancel={handleClose}
      footer={
        <>
          <Button onClick={handleClose}>Отмена</Button>
          <Button
            type="primary"
            disabled={!selectedFile || importCsv.isSuccess}
            loading={importCsv.isPending}
            onClick={handleImport}
          >
            Импортировать
          </Button>
        </>
      }
    >
      <Typography.Paragraph type="secondary">
        Загрузите CSV-файл с операциями. Корректные строки будут сразу добавлены
        в вашу финансовую историю.
      </Typography.Paragraph>

      {importCsv.isError && (
        <Alert
          className="operations-import-alert"
          type="error"
          showIcon
          message={errorMessage ?? "Не удалось импортировать файл"}
        />
      )}

      {importCsv.data && (
        <>
          <Alert
            className="operations-import-alert"
            type={importCsv.data.failed ? "warning" : "success"}
            showIcon
            message={`Добавлено операций: ${importCsv.data.saved.created}`}
            description={
              importCsv.data.failed
                ? `Не удалось обработать строк: ${importCsv.data.failed}.`
                : `Обработано строк: ${importCsv.data.total}.`
            }
          />
          {importCsv.data.errors.length > 0 && (
            <ul className="operations-import-errors">
              {importCsv.data.errors.map((error) => (
                <li key={`${error.row}-${error.field ?? "unknown"}`}>
                  Строка {error.row}: {error.message}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Upload.Dragger
        className="operations-import-dragger"
        accept=".csv,text/csv"
        fileList={fileList}
        maxCount={1}
        beforeUpload={(file) => {
          const isCsv = file.name.toLowerCase().endsWith(".csv");
          const isWithinSizeLimit = file.size <= 5 * 1024 * 1024;

          if (!isCsv) {
            message.error("Выберите файл в формате CSV");
            return Upload.LIST_IGNORE;
          }

          if (!isWithinSizeLimit) {
            message.error("Размер файла не должен превышать 5 МБ");
            return Upload.LIST_IGNORE;
          }

          return false;
        }}
        onChange={({ fileList: nextFileList }) => {
          importCsv.reset();
          setFileList(nextFileList.slice(-1));
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Перетащите CSV-файл сюда</p>
        <p className="ant-upload-hint">или выберите файл с компьютера</p>
      </Upload.Dragger>
    </Modal>
  );
}
