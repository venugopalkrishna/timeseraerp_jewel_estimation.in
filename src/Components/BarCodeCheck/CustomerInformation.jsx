import { Input, Modal } from "antd";
import styles from "./Customer.module.css";
import { useEffect, useRef } from "react";

const CustomerInformation = ({
  customerOpen,
  setCustomerOpen,
  handleOk,
  handleCancel,
  customerArea,
  setCustomerArea,
  customerName,
  setCustomerName,
  customerMobile,
  setCustomerMobile,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (customerOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [customerOpen]);
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
          Customer Details
        </strong>
      }
      open={customerOpen}
      onOk={handleCancel}
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
            <span className={styles.label2}>Contact No</span>
            {/* <span className={styles.separator2}>:</span> */}
            <span className={styles.value2}>
              <Input
                placeholder="Enter Customer No"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                ref={inputRef}
                value={customerMobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setCustomerMobile(value);
                  }
                }}
              />
            </span>
          </div>
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Name</span>
            {/* <span className={styles.separator2}>:</span> */}
            <span className={styles.value2}>
              <Input
                placeholder="Enter Customer Name"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </span>
          </div>
          <div className={styles.rowTag2}>
            <span className={styles.label2}>City</span>
            {/* <span className={styles.separator2}>:</span> */}
            <span className={styles.value2}>
              <Input
                placeholder="Enter Area"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                value={customerArea}
                onChange={(e) => setCustomerArea(e.target.value)}
              />
            </span>
          </div>
        </div>
      </div>
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "90px" }}>Contact No:</div>
          <Input
            placeholder="Enter Customer No"
            style={{ width: "220px", height: 32, fontSize: "16px" }}
            value={customerMobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setCustomerMobile(value);
              }
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "90px" }}>Name:</div>
          <Input
            placeholder="Enter Customer Name"
            style={{ width: "220px", height: 32, fontSize: "16px" }}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "90px" }}>City:</div>
          <Input
            placeholder="Enter Area"
            style={{ width: "220px", height: 32, fontSize: "16px" }}
            value={customerArea}
            onChange={(e) => setCustomerArea(e.target.value)}
          />
        </div>
      </div> */}
    </Modal>
  );
};

export default CustomerInformation;
