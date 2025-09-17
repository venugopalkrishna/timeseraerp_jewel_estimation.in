import { Modal, Button } from "antd";

const PrintTemplateDialog = ({
  open,
  onCancel,
  handleEposPrint,
  handleEposPrintModule2,
  createEstimationData,
  createEstimationMast,
  estimationDeleteData,
  estimationDeleteMast,
  tagNo,
}) => {
  const handlePrintWithAPIs = (printFn) => {
    try {
      // Call print immediately
      printFn();

      // After 2 seconds, call both APIs
      setTimeout(async () => {
        try {
          await createEstimationData();
          await createEstimationMast();
        } catch (error) {
          console.error("Error creating estimation:", error);
        } finally {
          onCancel();
        }
      }, 2000);
    } catch (error) {
      console.error("Error running print function:", error);
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      onCancel={onCancel}
      maskStyle={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      title={
        <div
          style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}
        >
          PRINT
        </div>
      }
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <button
        onClick={async () => {
          handleEposPrint();

          if (tagNo) {
            // Wait for deletion to finish first
            await estimationDeleteData();
            await estimationDeleteMast();
          }

          // Then create new records
          await createEstimationData();
          await createEstimationMast();

          onCancel();
        }}
        style={{
          width: "90%",
          padding: "10px 0",
          border: "2px solid orange",
          borderRadius: "50px",
          background: "white",
          fontWeight: "bold",
          fontSize: "14px",
          letterSpacing: "1px",
          cursor: "pointer",
        }}
      >
        TEMPLATE 1
      </button>

      <button
        onClick={async () => {
          handleEposPrintModule2();
          if (tagNo) {
            await estimationDeleteData();
            await estimationDeleteMast();
          }
          await createEstimationData();
          await createEstimationMast();
          onCancel();
        }}
        style={{
          width: "90%",
          padding: "10px 0",
          border: "2px solid orange",
          borderRadius: "50px",
          background: "white",
          fontWeight: "bold",
          fontSize: "14px",
          letterSpacing: "1px",
          cursor: "pointer",
        }}
      >
        TEMPLATE 2
      </button>

      <Button
        type="text"
        style={{
          color: "blue",
          marginTop: "10px",
          fontWeight: "bold",
        }}
        onClick={onCancel}
      >
        CANCEL
      </Button>
    </Modal>
  );
};

export default PrintTemplateDialog;
