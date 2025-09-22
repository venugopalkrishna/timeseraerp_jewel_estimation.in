import { Input, Modal } from "antd";
import styles from "./Customer.module.css";
import { useEffect, useRef, useState } from "react";

const WastageDialog = ({
  wastageOpen,
  handleCancel,
  setWastageData,
  wastageData,
  wastageTagNo,
}) => {
  const inputRef = useRef(null);

  // ✅ Find selected tag data
  const selectedWastage = wastageData.find((w) => w.TAGNO === wastageTagNo);

  // ✅ Local state for inputs (keep as string for smoother typing)
  const [formValues, setFormValues] = useState({
    NWT: "",
    WASTAGE: "",
    DIRECTWT: "",
    TOTALWT: "",
  });

  useEffect(() => {
    if (selectedWastage) {
      const hasDirect =
        selectedWastage.DIRECTWT && selectedWastage.DIRECTWT > 0;

      setFormValues({
        NWT:
          selectedWastage.NWT !== undefined
            ? selectedWastage.NWT.toFixed(3)
            : "",
        WASTAGE: hasDirect
          ? "0" // ✅ Auto force WASTAGE = 0 if DIRECT > 0
          : selectedWastage.WASTAGE ?? "",
        DIRECTWT:
          selectedWastage.DIRECTWT !== undefined
            ? Number(selectedWastage.DIRECTWT).toFixed(3)
            : "",
        TOTALWT:
          selectedWastage.TOTALWT !== undefined
            ? Number(selectedWastage.TOTALWT).toFixed(3)
            : "",
      });
    }
  }, [selectedWastage]);

  useEffect(() => {
    if (wastageOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [wastageOpen]);

  const handleFloatChange = (key, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setFormValues((prev) => {
        const updated = { ...prev, [key]: value };

        if (key === "DIRECTWT") {
          const direct = parseFloat(value) || 0;

          if (direct > 0) {
            // ✅ Force WASTAGE = 0
            updated.WASTAGE = "0";
          } else {
            // ✅ Restore original WASTAGE value from selectedWastage
            updated.WASTAGE =
              selectedWastage?.WASTAGE !== undefined
                ? selectedWastage.WASTAGE.toString()
                : "";
          }
        }

        return updated;
      });
    }
  };

  // ✅ Save: convert back to float safely
  const handleSave = () => {
    setWastageData((prevData) =>
      prevData.map((item) => {
        if (item.TAGNO !== wastageTagNo) return item;

        const NWT = formValues.NWT ? parseFloat(formValues.NWT) : 0;
        const hasDirect =
          formValues.DIRECTWT && parseFloat(formValues.DIRECTWT) > 0;
        const DIRECTWT = hasDirect ? parseFloat(formValues.DIRECTWT) : 0;

        // ✅ If DIRECTWT > 0, force WASTAGE = 0
        const WASTAGE = hasDirect
          ? 0
          : formValues.WASTAGE
          ? parseFloat(formValues.WASTAGE)
          : 0;

        return {
          ...item,
          NWT,
          WASTAGE, // always overwrite (force 0 if Direct entered)
          DIRECTWT,
          TOTALWT: hasDirect
            ? DIRECTWT
            : parseFloat(((NWT * WASTAGE) / 100).toFixed(3)),
        };
      })
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
            background: "#114a3d",
            borderRadius: "8px",
            padding: "4px 8px",
            color: "white",
          }}
        >
          Wastage Change
        </strong>
      }
      open={wastageOpen}
      onOk={handleSave}
      onCancel={handleCancel}
      closable={false}
      okText="OK"
      cancelText="Cancel"
      maskStyle={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
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

          {/* WASTAGE */}
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Wastage</span>
            <span className={styles.value2}>
              <Input
                placeholder="Enter Wastage"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                ref={inputRef}
                value={formValues.WASTAGE}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    WASTAGE: e.target.value,
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
                placeholder="Enter Direct Wt"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                value={formValues.DIRECTWT}
                onChange={(e) => handleFloatChange("DIRECTWT", e.target.value)}
              />
            </span>
          </div>

          {/* TOTALWT */}
          <div className={styles.rowTag2}>
            <span className={styles.label2}>Total</span>
            <span className={styles.value2}>
              <Input
                placeholder="Enter Total Wt"
                style={{ width: "200px", height: 32, fontSize: "16px" }}
                disabled
                value={formValues.TOTALWT}
                onChange={(e) => handleFloatChange("TOTALWT", e.target.value)}
              />
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WastageDialog;
