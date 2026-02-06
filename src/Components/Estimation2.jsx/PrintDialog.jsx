import { Modal, Button } from "antd";

const PrintTemplateDialog = ({
  open,
  onCancel,
  handleEposPrint,
  handleEposPrintModule2,
  handlePrintModule1,
  handlePrintModule2,
  createEstimationData,
  createEstimationMast,
  createEstimationItems,
  estimationDeleteData,
  estimationDeleteMast,
  estimationDeleteItems,
  tagNo,
  pdfModule,
  estimationNo,
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
          await createEstimationItems();
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
      // maskStyle={{
      //   backdropFilter: "blur(8px)",
      //   backgroundColor: "rgba(0, 0, 0, 0.2)",
      // }}
      title={
        <strong
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            background: "#FFC107",
            borderRadius: "8px",
            padding: "4px 8px",
          }}
        >
          PRINT MODELS
        </strong>
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
          if (pdfModule === "WIFI") {
            handleEposPrint();
          } else {
            handlePrintModule1();
          }

          if (tagNo) {
            await estimationDeleteData();
            await estimationDeleteMast();
            await estimationDeleteItems();
            await createEstimationData();
            await createEstimationMast();
            await createEstimationItems();
          } else {
            const nextInvNo = await estimationNo();
            await createEstimationData(nextInvNo);
            await createEstimationMast(nextInvNo);
            await createEstimationItems(nextInvNo);
          }

          onCancel();
        }}
        style={{
          width: "90%",
          padding: "20px 0",
          border: "2px solid orange",
          borderRadius: "50px",
          background: "white",
          fontWeight: "bold",
          fontSize: "18px",
          letterSpacing: "1px",
          cursor: "pointer",
        }}
      >
        TEMPLATE 1
      </button>

      <button
        onClick={async () => {
          if (pdfModule === "WIFI") {
            handleEposPrintModule2();
          } else {
            handlePrintModule2();
          }
          if (tagNo) {
            await estimationDeleteData();
            await estimationDeleteMast();
            await estimationDeleteItems();
            await createEstimationData();
            await createEstimationMast();
            await createEstimationItems();
          } else {
            const nextInvNo = await estimationNo();
            await createEstimationData(nextInvNo);
            await createEstimationMast(nextInvNo);
            await createEstimationItems(nextInvNo);
          }
          onCancel();
        }}
        style={{
          width: "90%",
          padding: "20px 0",
          border: "2px solid orange",
          borderRadius: "50px",
          background: "white",
          fontWeight: "bold",
          fontSize: "18px",
          letterSpacing: "1px",
          cursor: "pointer",
        }}
      >
        TEMPLATE 2
      </button>

      <Button
        type="text"
        style={{
          width: "100%",
          marginTop: "10px",
          fontWeight: "bold",
          background: "#f3550cff",
          borderRadius: "8px",
          padding: "4px 8px",
        }}
        onClick={onCancel}
      >
        CANCEL
      </Button>
    </Modal>
  );
};

export default PrintTemplateDialog;
