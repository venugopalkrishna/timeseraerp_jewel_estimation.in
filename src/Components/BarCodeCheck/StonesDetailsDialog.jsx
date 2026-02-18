import CloseIcon from "@mui/icons-material/Close";
import { Modal } from "antd";
import { useEffect, useState } from "react";

const StonesDetailsDialog = ({
  stonesOpen,
  handleCancel,
  stonesData: initialStonesData,
  setStonesData,
  stoneNo,
  homeNo,
}) => {
  const [localStones, setLocalStones] = useState(initialStonesData || []);

  useEffect(() => {
    setLocalStones(initialStonesData || []);
  }, [initialStonesData]);
  // const matchedStones = localStones.filter((stone) => stone.TAGNO === stoneNo);
  const matchedStones = localStones.filter((stone) => {
    if (stoneNo > 0) {
      return stone.TAGNO === stoneNo;
    } else {
      return stone.ISSBRANCHNAME === homeNo;
    }
  });
  return (
    <Modal
      open={stonesOpen}
      // onCancel={handleCancel}
      footer={null}
      closable={false}
      // maskStyle={{
      //   backdropFilter: "blur(8px)",
      //   backgroundColor: "rgba(0, 0, 0, 0.2)",
      // }}
      title={
        <div style={{ position: "relative" }}>
          <strong
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
              background: "#00e5ff",
              borderRadius: "8px",
              padding: "4px 8px",
            }}
          >
            Stone Details
          </strong>
          <CloseIcon
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#000",
            }}
            onClick={handleCancel}
          />
        </div>
      }
    >
      {/* {matchedStones.map((stone, index) => (
        <div
          key={stone.id}
          style={{
            background:
              "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
            marginBottom: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "1.5px solid #162566",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "12px",
              color: "#555",
              fontWeight: "bold",
            }}
          >
            <div>
              Item:
              <span style={{ fontWeight: "bold", color: "#52bd91" }}>
                {stone.ITEMNAME}
              </span>
              <span style={{ fontWeight: "bold", color: "red" }}>
                {stone.PIECES > 0
                  ? `(${stone.PIECES} piece${stone.PIECES > 1 ? "s" : ""})`
                  : stone.GRMS > 0
                  ? `(${stone.GRMS?.toFixed(3)}/g)`
                  : `(${stone.CTS?.toFixed(3)}cts)`}
              </span>{" "}
              Rate:
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {stone.RATE}
              </span>
            </div>
            <div>
              <span
                style={{
                  border: "1px solid #52bd91",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  marginLeft: "6px",
                  fontSize: "11px",
                  background: " #52bd91",
                  color: "#FFFFFF",
                }}
              >
                #{stone.SNO}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#555",
              fontWeight: "bold",
              borderTop: "1px dashed #ccc",
              paddingTop: "6px",
            }}
          >
            <div>
              Amount:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: "#52bd91",
                  fontSize: "14px",
                }}
              >
                ₹{stone?.AMOUNT?.toFixed(2)}
              </span>
            </div>
            <div>
              NoPcs:{" "}
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {stone.NOPCS}
              </span>
            </div>
          </div>
          {(stone.COLOUR !== "-" ||
            stone.CUT !== "-" ||
            stone.CLARITY !== "-") && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#555",
                borderTop: "1px dashed #ccc",
                fontWeight: "bold",
                paddingTop: "6px",
              }}
            >
              {stone.COLOUR !== "-" && (
                <div>
                  Colour:{" "}
                  <span style={{ fontWeight: "bold", color: "#162566" }}>
                    {stone.COLOUR}
                  </span>
                </div>
              )}
              {stone.CUT !== "-" && (
                <div>
                  Cut:{" "}
                  <span style={{ fontWeight: "bold", color: "#162566" }}>
                    {stone.CUT}
                  </span>
                </div>
              )}
              {stone.CLARITY !== "-" && (
                <div>
                  Clarity:{" "}
                  <span style={{ fontWeight: "bold", color: "#162566" }}>
                    {stone.CLARITY}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))} */}
      {matchedStones.map((stone, index) => (
        <div
          key={stone.id}
          style={{
            background:
              "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
            marginBottom: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "1.5px solid #162566",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "12px",
              color: "#555",
              fontWeight: "bold",
            }}
          >
            <div>
              Item:
              <span style={{ fontWeight: "bold", color: "#52bd91" }}>
                {stone.ITEMNAME}
              </span>
              {/* <span style={{ fontWeight: "bold", color: "red" }}>
                {stone.PIECES > 0
                  ? `(${stone.PIECES} piece${stone.PIECES > 1 ? "s" : ""})`
                  : stone.GRMS > 0
                  ? `(${stone.GRMS?.toFixed(3)}/g)`
                  : `(${stone.CTS?.toFixed(3)}cts)`}
              </span> */}{" "}
              {/* Rate:
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={stone.RATE ?? ""}
                  style={{
                    width: "80px",
                    textAlign: "right",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "2px 4px",
                  }}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setStonesData((prevData) =>
                      prevData.map((item) => {
                        const isSameStone =
                          (stoneNo > 0 &&
                            item.TAGNO === stoneNo &&
                            item.SNO === stone.SNO) ||
                          (stoneNo <= 0 &&
                            item.ISSBRANCHNAME === stoneIssBranch &&
                            item.SNO === stone.SNO);
                        if (!isSameStone) return item;

                        const qty =
                          Number(stone.PIECES) > 0
                            ? Number(stone.PIECES)
                            : Number(stone.CTS) > 0
                            ? Number(stone.CTS)
                            : Number(stone.GRMS) > 0
                            ? Number(stone.GRMS)
                            : 0;

                        const amount = parseFloat((value * qty).toFixed(2));
                        return { ...item, RATE: value, AMOUNT: amount };
                      })
                    );
                  }}
                />
              </span> */}
            </div>
            <div>
              <span
                style={{
                  border: "1px solid #52bd91",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  marginLeft: "6px",
                  fontSize: "11px",
                  background: " #52bd91",
                  color: "#FFFFFF",
                }}
              >
                #{stone.SNO}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#555",
              fontWeight: "bold",
              borderTop: "1px dashed #ccc",
              paddingTop: "6px",
            }}
          >
            <div>
              PCS:{" "}
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {/* {stone.RATE} */}
                {/* {isEditable ? ( */}
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={stone.PIECES ?? ""}
                  style={{
                    width: "80px",
                    textAlign: "right",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "2px 4px",
                  }}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setStonesData((prevData) =>
                      prevData.map((item) => {
                        const isSameStone =
                          (stoneNo > 0 &&
                            item.TAGNO === stoneNo &&
                            item.SNO === stone.SNO) ||
                          (stoneNo <= 0 &&
                            item.ISSBRANCHNAME === homeNo &&
                            item.SNO === stone.SNO);
                        if (!isSameStone) return item;

                        const rate = parseFloat(stone.RATE) || 0;
                        const amount = parseFloat((value * rate).toFixed(2));
                        return {
                          ...item,
                          PIECES: value,
                          AMOUNT: amount,
                          CTS: 0,
                          GRMS: 0,
                        };
                      }),
                    );
                  }}
                />
                {/* ) : (
                  Number(stone?.PIECES || 0).toFixed(0)
                )} */}
              </span>
            </div>
            <div>
              CTS:{" "}
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {/* {isEditable ? ( */}
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={stone.CTS ?? ""}
                  style={{
                    width: "80px",
                    textAlign: "right",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "2px 4px",
                  }}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setStonesData((prevData) =>
                      prevData.map((item) => {
                        const isSameStone =
                          (stoneNo > 0 &&
                            item.TAGNO === stoneNo &&
                            item.SNO === stone.SNO) ||
                          (stoneNo <= 0 &&
                            item.ISSBRANCHNAME === homeNo &&
                            item.SNO === stone.SNO);
                        if (!isSameStone) return item;

                        const rate = parseFloat(stone.RATE) || 0;
                        const amount = parseFloat((value * rate).toFixed(2));
                        return {
                          ...item,
                          CTS: value,
                          AMOUNT: amount,
                          PIECES: 0,
                          GRMS: 0,
                        };
                      }),
                    );
                  }}
                />
                {/* ) : (
                  Number(stone?.CTS || 0).toFixed(3)
                )} */}
              </span>
            </div>
            <div>
              Grams:{" "}
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {/* {isEditable ? ( */}
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={stone.GRMS ?? ""}
                  style={{
                    width: "80px",
                    textAlign: "right",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "2px 4px",
                  }}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setStonesData((prevData) =>
                      prevData.map((item) => {
                        const isSameStone =
                          (stoneNo > 0 &&
                            item.TAGNO === stoneNo &&
                            item.SNO === stone.SNO) ||
                          (stoneNo <= 0 &&
                            item.ISSBRANCHNAME === homeNo &&
                            item.SNO === stone.SNO);
                        if (!isSameStone) return item;

                        const rate = parseFloat(stone.RATE) || 0;
                        const amount = parseFloat((value * rate).toFixed(2));
                        return {
                          ...item,
                          GRMS: value,
                          AMOUNT: amount,
                          PIECES: 0,
                          CTS: 0,
                        };
                      }),
                    );
                  }}
                />
                {/* ) : (
                  Number(stone?.GRMS || 0).toFixed(3)
                )} */}
              </span>
            </div>

            {/* <div>
              NoPcs:{" "}
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {stone.NOPCS}
              </span>
            </div> */}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#555",
              fontWeight: "bold",
              borderTop: "1px dashed #ccc",
              paddingTop: "6px",
            }}
          >
            <div>
              Rate:{" "}
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {/* {stone.RATE} */}
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={stone.RATE ?? ""}
                  style={{
                    width: "80px",
                    textAlign: "right",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "2px 4px",
                  }}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setStonesData((prevData) =>
                      prevData.map((item) => {
                        const isSameStone =
                          (stoneNo > 0 &&
                            item.TAGNO === stoneNo &&
                            item.SNO === stone.SNO) ||
                          (stoneNo <= 0 &&
                            item.ISSBRANCHNAME === homeNo &&
                            item.SNO === stone.SNO);
                        if (!isSameStone) return item;

                        const qty =
                          Number(stone.PIECES) > 0
                            ? Number(stone.PIECES)
                            : Number(stone.CTS) > 0
                              ? Number(stone.CTS)
                              : Number(stone.GRMS) > 0
                                ? Number(stone.GRMS)
                                : 0;

                        const amount = parseFloat((value * qty).toFixed(2));
                        return { ...item, RATE: value, AMOUNT: amount };
                      }),
                    );
                  }}
                />
              </span>
            </div>
            <div>
              Amount:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: "#52bd91",
                  fontSize: "14px",
                }}
              >
                ₹{stone?.AMOUNT?.toFixed(2)}
              </span>
            </div>
            {/* <div>
              NoPcs:{" "}
              <span style={{ fontWeight: "bold", color: "#162566" }}>
                {stone.NOPCS}
              </span>
            </div> */}
          </div>
          {(stone.COLOUR !== "-" ||
            stone.CUT !== "-" ||
            stone.CLARITY !== "-") && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#555",
                borderTop: "1px dashed #ccc",
                fontWeight: "bold",
                paddingTop: "6px",
              }}
            >
              {stone.COLOUR !== "-" && (
                <div>
                  Colour:{" "}
                  <span style={{ fontWeight: "bold", color: "#162566" }}>
                    {stone.COLOUR}
                  </span>
                </div>
              )}
              {stone.CUT !== "-" && (
                <div>
                  Cut:{" "}
                  <span style={{ fontWeight: "bold", color: "#162566" }}>
                    {stone.CUT}
                  </span>
                </div>
              )}
              {stone.CLARITY !== "-" && (
                <div>
                  Clarity:{" "}
                  <span style={{ fontWeight: "bold", color: "#162566" }}>
                    {stone.CLARITY}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </Modal>
  );
};

export default StonesDetailsDialog;
