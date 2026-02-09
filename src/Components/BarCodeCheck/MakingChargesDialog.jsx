import { Input, Modal } from "antd";
import styles from "./Customer.module.css";
import { useEffect, useRef, useState } from "react";

const MakingChargesDialog = ({
  mcOpen,
  handleCancel,
  setMcData,
  mcData,
  mcTagNo,
  mcHomeKey,
}) => {
  const inputRef = useRef(null);

  // ✅ Find selected tag data
  const selectedWastage =
    mcTagNo > 0
      ? mcData.find((w) => w.TAGNO === mcTagNo)
      : mcData.find((w) => w.ISSBRANCHNAME === mcHomeKey);

  // ✅ Local state for inputs (keep as string for smoother typing)
  const [formValues, setFormValues] = useState({
    NWT: "",
    MAKINGCHARGES: "",
    DIRECTAMT: "",
    TOTALAMT: "",
  });

  useEffect(() => {
    if (selectedWastage) {
      const hasDirect =
        selectedWastage.DIRECTAMT && selectedWastage.DIRECTAMT > 0;

      setFormValues({
        NWT:
          selectedWastage.NWT !== undefined
            ? selectedWastage.NWT.toFixed(3)
            : "",
        MAKINGCHARGES: hasDirect
          ? "0" // ✅ Auto force MAKINGCHARGES = 0 if DIRECTAMT > 0
          : (selectedWastage.MAKINGCHARGES ?? ""),
        DIRECTAMT:
          selectedWastage.DIRECTAMT !== undefined
            ? Number(selectedWastage.DIRECTAMT).toFixed(2)
            : "",
        TOTALAMT:
          selectedWastage.TOTALAMT !== undefined
            ? Number(selectedWastage.TOTALAMT).toFixed(2)
            : "",
      });
    }
  }, [selectedWastage]);

  useEffect(() => {
    if (mcOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mcOpen]);

  const handleFloatChange = (key, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setFormValues((prev) => {
        const updated = { ...prev, [key]: value };

        if (key === "DIRECTAMT") {
          const direct = parseFloat(value) || 0;

          if (direct > 0) {
            // ✅ Force MAKINGCHARGES = 0
            updated.MAKINGCHARGES = "0";
          } else {
            // ✅ Restore original MAKINGCHARGES value from selectedWastage
            updated.MAKINGCHARGES =
              selectedWastage?.MAKINGCHARGES !== undefined
                ? selectedWastage.MAKINGCHARGES.toString()
                : "";
          }
        }

        return updated;
      });
    }
  };

  // ✅ Save: convert back to float safely
  const handleSave = () => {
    setMcData((prevData) =>
      prevData.map((item) => {
        if (item.TAGNO !== mcTagNo) return item;

        const NWT = formValues.NWT ? parseFloat(formValues.NWT) : 0;
        const hasDirect =
          formValues.DIRECTAMT && parseFloat(formValues.DIRECTAMT) > 0;
        const DIRECTAMT = hasDirect ? parseFloat(formValues.DIRECTAMT) : 0;

        // ✅ If DIRECTAMT > 0, force MAKINGCHARGES = 0
        const MAKINGCHARGES = hasDirect
          ? 0
          : formValues.MAKINGCHARGES
            ? parseFloat(formValues.MAKINGCHARGES)
            : 0;

        return {
          ...item,
          NWT,
          MAKINGCHARGES, // always overwrite (force 0 if Direct entered)
          DIRECTAMT,
          TOTALAMT: hasDirect
            ? DIRECTAMT
            : parseFloat((NWT * MAKINGCHARGES).toFixed(2)),
        };
      }),
    );

    handleCancel();
  };

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
            background: "#e2ca64",
            borderRadius: "8px",
            padding: "4px 8px",
            color: "white",
          }}
        >
          MC Change
        </strong>
      }
      open={mcOpen}
      onOk={handleSave}
      onCancel={handleCancel}
      closable={false}
      okText="OK"
      cancelText="Cancel"
      // maskStyle={{
      //   backdropFilter: "blur(8px)",
      //   backgroundColor: "rgba(0, 0, 0, 0.2)",
      // }}
      afterOpenChange={(open) => {
        if (open && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <div className={styles.cardContainer2}>
        <div className={styles.infoBox2}>
          {/* NWT */}
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Nwt</span>
            <span className={styles.value2}>
              <Input
                placeholder="Enter Nwt"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                disabled
                value={formValues.NWT}
                onChange={(e) => handleFloatChange("NWT", e.target.value)}
              />
            </span>
          </div>

          <div className={styles.rowTag2}>
            <span className={styles.label2}>MC</span>
            <span className={styles.value2}>
              <Input
                placeholder="Enter MC"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                ref={inputRef}
                onFocus={(e) => {
                  e.target.select();
                }}
                value={formValues.MAKINGCHARGES}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    MAKINGCHARGES: e.target.value,
                    DIRECTAMT: 0,
                  }))
                }
              />
            </span>
          </div>

          {/* DIRECTWT */}
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Direct</span>
            <span className={styles.value2}>
              <Input
                placeholder="Enter Direct Amt"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                onFocus={(e) => {
                  e.target.select();
                }}
                value={formValues.DIRECTAMT}
                onChange={(e) => handleFloatChange("DIRECTAMT", e.target.value)}
              />
            </span>
          </div>

          {/* TOTALWT */}
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Total</span>
            <span className={styles.value2}>
              <Input
                placeholder="Enter Total Amt"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                disabled
                value={formValues.TOTALAMT}
                onChange={(e) => handleFloatChange("TOTALAMT", e.target.value)}
              />
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MakingChargesDialog;
