import { Checkbox, Input, Modal } from "antd";
import styles from "./Customer.module.css";
import { useEffect, useRef } from "react";

const CalcWastageDialog = ({
  wastageStatus,
  handleCancel,
  setWastageCalc,
  wastageCalc,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (wastageStatus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [wastageStatus]);
  return (
    <Modal
      title={
        <strong
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            background: "#BF9264",
            borderRadius: "8px",
            padding: "4px 8px",
          }}
        >
          Wastage Calculation
        </strong>
      }
      open={wastageStatus}
      onOk={handleCancel}
      onCancel={handleCancel}
      closable={false}
      okText="OK"
      cancelText="Cancel"
      // maskStyle={{
      //   backdropFilter: "blur(8px)", // <- this applies the blur effect
      //   backgroundColor: "rgba(0, 0, 0, 0.2)", // optional: tint the background a little
      // }}
      afterOpenChange={(open) => {
        if (open && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <div className={styles.cardContainer2}>
        <div className={styles.infoBox2}>
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Wastage Type</span>
            <span
              className={styles.value2}
              style={{ display: "flex", gap: 16 }}
            >
              <Checkbox
                checked={wastageCalc === "NWT"}
                onChange={() => setWastageCalc("NWT")}
              >
                NWT
              </Checkbox>
              <Checkbox
                checked={wastageCalc === "GWT"}
                onChange={() => setWastageCalc("GWT")}
              >
                GWT
              </Checkbox>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CalcWastageDialog;
