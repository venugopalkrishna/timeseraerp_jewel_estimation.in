import { Button, Input, Modal, Select } from "antd";
import { useRef } from "react";
import styles from "./stoneadd.module.css";
import { DeleteOutlined } from "@mui/icons-material";

const { Option } = Select;

const StonesDetailsDialog = ({
  stoneOpen,
  setStoneOpen,
  selectStoneItem,
  setSelectStoneItem,
  stonePcs,
  setStonePcs,
  stoneCTS,
  setStoneCTS,
  stoneGrams,
  setStoneGrams,
  stoneRate,
  setStoneRate,
  stoneAmt,
  setStoneAmt,
  stoneNoPcs,
  setStoneNoPcs,
  stoneColour,
  setStoneColour,
  stoneCut,
  setStoneCut,
  stoneClarity,
  setStoneClarity,
  stoneDp,
  setStoneDp,
  handleSubmit,
  setStoneItemCode,
  stoneItemCode,
  setItemsData,
  itemsData,
  newStonesData,
  handleDelete,
}) => {
  const selectStoneItemRef = useRef(null);
  const stonePcsRef = useRef(null);
  const stoneCtsRef = useRef(null);
  const stoneGramsRef = useRef(null);
  const stoneRateRef = useRef(null);
  const stoneAmtRef = useRef(null);
  const stoneNoPcsRef = useRef(null);
  const stoneColourRef = useRef(null);
  const stoneCutRef = useRef(null);
  const stoneClarityRef = useRef(null);
  const stoneDpRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };
  const handleSubmitKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRef.current?.click();
    }
  };
  const handleAfterOpenChange = (visible) => {
    if (visible && selectStoneItemRef.current) {
      // Give a tiny delay to ensure the element is rendered
      setTimeout(() => {
        selectStoneItemRef.current.focus();
      }, 100);
    }
  };

  return (
    <Modal
      title={<strong className={styles.modalTitle}>Stone Details</strong>}
      open={stoneOpen}
      onCancel={() => setStoneOpen(false)}
      closable={false}
      footer={null}
      width="100%"
      //   height={200}
      afterOpenChange={(visible) => {
        if (visible && selectStoneItemRef.current) {
          setTimeout(() => selectStoneItemRef.current.focus(), 100);
        }
      }}
      // maskStyle={{
      //   backdropFilter: "blur(8px)",
      //   backgroundColor: "rgba(0, 0, 0, 0.2)",
      // }}
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles.modalBody}>
        {/* GRID CONTAINER */}
        <div className={styles.gridContainer}>
          {/* Item Name */}
          <div className={styles.fullRow}>
            <label className={styles.label}>Item Name</label>
            <Select
              allowClear
              showSearch
              placeholder="Select Item Name"
              ref={selectStoneItemRef}
              style={{ width: "100%", textAlign: "left", flex: 1 }}
              value={selectStoneItem || null}
              onChange={(value) => {
                if (value) {
                  // ✅ Set both item name and item code
                  setSelectStoneItem(value);
                  const selectedItem = itemsData.find(
                    (item) => item.ITEMNAME === value,
                  );
                  if (selectedItem) {
                    setStoneItemCode(selectedItem.ITEMCODE);
                  }
                } else {
                  // ✅ Clear both values when cleared
                  setSelectStoneItem(null);
                  setStoneItemCode("");
                }
                setTimeout(() => {
                  stonePcsRef?.current?.focus();
                }, 0);
              }}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const inputText = e.target.value?.toLowerCase() || "";
                  const filtered = itemsData.filter((m) =>
                    m.ITEMNAME.toLowerCase().includes(inputText),
                  );

                  if (filtered.length > 0) {
                    const selected = filtered[0].ITEMNAME;
                    const selectedCode = filtered[0]?.ITEMCODE;
                    setSelectStoneItem(selected);
                    setStoneItemCode(selectedCode);
                    setTimeout(() => {
                      stonePcsRef?.current?.focus();
                    }, 0);
                  }
                }
              }}
            >
              {itemsData.map((item, index) => (
                <Option key={index} value={item.ITEMNAME}>
                  {item.ITEMNAME}
                </Option>
              ))}
            </Select>
          </div>

          {/* Pieces */}
          <div>
            <label className={styles.label}>Pieces</label>
            <Input
              placeholder="Pieces"
              className={styles.input}
              onFocus={(e) => {
                e.target.select();
              }}
              ref={stonePcsRef}
              value={stonePcs}
              onChange={(e) => {
                const value = e.target.value;

                // ✅ Allow only float numbers (digits + one optional dot)
                if (/^\d*\.?\d{0,0}$/.test(value) && value.length <= 15) {
                  setStonePcs(value);
                  setStoneCTS();
                  setStoneGrams();
                  const amount = stoneRate * value;
                  setStoneAmt(amount?.toFixed(0) || 0);
                }
              }}
              onKeyDown={(e) => {
                if (stonePcs > 0) {
                  handleKeyDown(e, stoneRateRef);
                } else {
                  handleKeyDown(e, stoneCtsRef);
                }
              }}
            />
          </div>

          {/* CTS */}
          <div>
            <label className={styles.label}>CTS</label>
            <Input
              placeholder="CTS"
              className={styles.input}
              onFocus={(e) => {
                e.target.select();
              }}
              ref={stoneCtsRef}
              value={stoneCTS}
              onChange={(e) => {
                const value = e.target.value;

                // ✅ Allow only float numbers (digits + one optional dot)
                if (/^\d*\.?\d{0,3}$/.test(value) && value.length <= 15) {
                  setStoneCTS(value);
                  setStonePcs();
                  setStoneGrams();
                  const amount = stoneRate * value;
                  setStoneAmt(amount?.toFixed(0) || 0);
                }
              }}
              onKeyDown={(e) => {
                if (stoneCTS > 0) {
                  handleKeyDown(e, stoneRateRef);
                } else {
                  handleKeyDown(e, stoneGramsRef);
                }
              }}
            />
          </div>

          {/* Grams */}
          <div>
            <label className={styles.label}>Grams</label>
            <Input
              placeholder="Grams"
              className={styles.input}
              onFocus={(e) => {
                e.target.select();
              }}
              ref={stoneGramsRef}
              value={stoneGrams}
              onChange={(e) => {
                const value = e.target.value;

                // ✅ Allow only float numbers (digits + one optional dot)
                if (/^\d*\.?\d{0,3}$/.test(value) && value.length <= 15) {
                  setStoneGrams(value);
                  setStonePcs();
                  setStoneCTS();
                  const amount = stoneRate * value;
                  setStoneAmt(amount?.toFixed(0) || 0);
                }
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, stoneRateRef);
              }}
            />
          </div>

          {/* Rate + Amount */}
          <div className={styles.doubleRow}>
            <div>
              <label className={styles.label}>Rate</label>
              <Input
                placeholder="Rate"
                className={styles.input}
                onFocus={(e) => e.target.select()}
                ref={stoneRateRef}
                value={stoneRate}
                onChange={(e) => {
                  const value = e.target.value;

                  // ✅ Allow only valid float numbers (up to 2 decimals and 15 digits total)
                  if (/^\d*\.?\d{0,2}$/.test(value) && value.length <= 15) {
                    setStoneRate(value);

                    const rate = parseFloat(value) || 0;
                    const pcs = parseFloat(stonePcs) || 0;
                    const cts = parseFloat(stoneCTS) || 0;
                    const grams = parseFloat(stoneGrams) || 0;

                    // ✅ Calculate amount (priority: PCS > CTS > GRMS)
                    let amount = 0;
                    if (pcs > 0) amount = rate * pcs;
                    else if (cts > 0) amount = rate * cts;
                    else if (grams > 0) amount = rate * grams;

                    setStoneAmt(amount.toFixed(0) || 0);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, stoneAmtRef)}
              />
            </div>
            <div>
              <label className={styles.label}>Amount</label>
              <Input
                placeholder="Amount"
                className={styles.input}
                onFocus={(e) => e.target.select()}
                ref={stoneAmtRef}
                value={stoneAmt || 0}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(value) && value.length <= 15) {
                    setStoneAmt(value || 0);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, saveRef)}
              />
            </div>
          </div>

          {/* No.Pcs, Colour, Cut, Clarity */}
          {/* <div>
            <label className={styles.label}>No.Pcs</label>
            <Input
              placeholder="No.Pcs"
              className={styles.input}
              onFocus={(e) => {
                e.target.select();
              }}
              ref={stoneNoPcsRef}
              value={stoneNoPcs}
              onChange={(e) => {
                const value = e.target.value;

                // ✅ Allow only float numbers (digits + one optional dot)
                if (/^\d*\.?\d{0,0}$/.test(value) && value.length <= 15) {
                  setStoneNoPcs(value);
                }
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, saveRef);
              }}
            />
          </div> */}
        </div>

        {/* Footer Buttons */}
        <div className={styles.footerButtons}>
          <Button
            onClick={() => {
              setStoneOpen(false);
            }}
            className={styles.cancelBtn}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            ref={saveRef}
            className={styles.saveBtn}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
      <div className={styles.cardContainer}>
        {newStonesData?.map((item, index) => (
          <div key={index} className={styles.infoBox}>
            <div className={styles.rowTag}>
              <p>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                    borderRadius: "50%",
                    padding: "5px",
                    background: "red",
                    color: "white",
                  }}
                >
                  #{index + 1}
                </span>
              </p>
              <p>
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {item.ITEMNAME}
                </span>
              </p>
              <DeleteOutlined
                style={{
                  color: "red",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                onClick={() => handleDelete(index)}
              />
            </div>
            <hr className={styles.fullWidthLine} />
            <div className={styles.row}>
              <p style={{ fontSize: "12px" }}>
                Pieces:{" "}
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {item.PIECES}
                </span>
              </p>
              <p style={{ fontSize: "12px" }}>
                CTS:{" "}
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {Number(item.CTS)?.toFixed(3)}
                </span>
              </p>
              <p style={{ fontSize: "12px" }}>
                Grams:{" "}
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {Number(item.GRAMS)?.toFixed(3)}
                </span>
              </p>
            </div>
            <hr className={styles.fullWidthLine} />

            {/* Gross Wt, Less Wt, Net Wt */}
            <div className={styles.row}>
              <p style={{ fontSize: "12px" }}>
                Rate:{" "}
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {Number(item.RATE)?.toFixed(2)}
                </span>
              </p>
              <p style={{ fontSize: "12px" }}>
                Amount:{" "}
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {Number(item.AMOUNT)?.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default StonesDetailsDialog;
