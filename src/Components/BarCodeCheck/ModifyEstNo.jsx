import { Input, Modal } from "antd";
import styles from "./ModifyEstNo.module.css";
import { useEffect, useRef } from "react";

const ModifyEstNo = ({
  modifyOpen,
  handleCancel,
  modifyCode,
  setModifyCode,
  estimationNoDataAPI,
  handleReset,
  setTagNo,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (modifyOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modifyOpen]);
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
            background: "#0cf3e0",
            borderRadius: "8px",
            padding: "4px 8px",
          }}
        >
          MODIFY
        </strong>
      }
      open={modifyOpen}
      onOk={() => {
        estimationNoDataAPI();
        handleReset();
      }}
      onCancel={handleCancel}
      closable={false}
      okText="OK"
      cancelText="Cancel"
      maskStyle={{
        backdropFilter: "blur(8px)", // <- this applies the blur effect
        backgroundColor: "rgba(0, 0, 0, 0.2)", // optional: tint the background a little
      }}
      afterOpenChange={(open) => {
        if (open && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <div className={styles.cardContainer2}>
        <div className={styles.infoBox2}>
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Estimation No</span>
            {/* <span className={styles.separator2}>:</span> */}
            <span className={styles.value2}>
              <Input
                ref={inputRef}
                placeholder="Enter Estimation No"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                value={modifyCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setModifyCode(value);
                    setTagNo(value);
                  }
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModifyEstNo;
