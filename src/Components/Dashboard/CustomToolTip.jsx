const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "10px 15px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 9999,
          minWidth: "140px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: 8,
            color: "#000",
          }}
        >
          {data.date}
        </p>
        {data.TotPieces !== undefined && (
          <p style={{ margin: "2px 0 0 0", fontSize: "14px" }}>
            Pieces: <strong>{data.TotPieces}</strong>
          </p>
        )}
        {data.TotGwt !== undefined && (
          <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
            Gwt: <strong>{data.TotGwt?.toFixed(3)}</strong>
          </p>
        )}
        {data.TotNwt !== undefined && (
          <p style={{ margin: "2px 0 0 0", fontSize: "14px" }}>
            Nwt: <strong>{data.TotNwt?.toFixed(3)}</strong>
          </p>
        )}
        <p style={{ fontSize: "15px", margin: 0 }}>
          Amt :{" "}
          <span style={{ fontWeight: 500, color: "#6a0dad" }}>
            {data.amt?.toFixed(2)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
