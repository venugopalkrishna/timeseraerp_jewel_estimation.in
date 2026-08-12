import { Modal, Button } from "antd";

const PrintTemplateDialog = ({
  open,
  onCancel,
  handleEposPrint,
  handleEposPrintModule2,
  handlePrintModule1,
  handlePrintModule2,
  handleSave,
  pdfModule,
  estimationNo,
}) => {
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
            let nextInvNo = 0;

            nextInvNo = await estimationNo();

            // const nextInvNo = await estimationNo();
            handleEposPrint(nextInvNo);
          } else {
            let nextInvNo = 0;

            nextInvNo = await estimationNo();

            // const nextInvNo = await estimationNo();
            handlePrintModule1(nextInvNo);
          }

          let nextInvNo = 0;

          nextInvNo = await estimationNo();

          await handleSave(nextInvNo);

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
            let nextInvNo = 0;

            nextInvNo = await estimationNo();

            // const nextInvNo = await estimationNo();
            handleEposPrintModule2(nextInvNo);
          } else {
            let nextInvNo = 0;

            nextInvNo = await estimationNo();

            // const nextInvNo = await estimationNo();
            handlePrintModule2(nextInvNo);
          }

          let nextInvNo = 0;
          nextInvNo = await estimationNo();

          await handleSave(nextInvNo);

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
