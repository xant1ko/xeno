import { InboxOutlined } from "@ant-design/icons";
import { Button, Modal, Typography, Upload } from "antd";
import type { UploadFile } from "antd";
import { useState } from "react";

type ImportOperationsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ImportOperationsModal({
  open,
  onClose,
}: ImportOperationsModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleClose = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title="Импорт операций"
      open={open}
      onCancel={handleClose}
      footer={<Button onClick={handleClose}>Отмена</Button>}
    >
      <Typography.Paragraph type="secondary">
        Загрузите CSV-файл с операциями. На следующем шаге мы покажем его
        содержимое перед импортом.
      </Typography.Paragraph>

      <Upload.Dragger
        className="operations-import-dragger"
        accept=".csv,text/csv"
        fileList={fileList}
        maxCount={1}
        beforeUpload={() => false}
        onChange={({ fileList: nextFileList }) => setFileList(nextFileList.slice(-1))}
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
