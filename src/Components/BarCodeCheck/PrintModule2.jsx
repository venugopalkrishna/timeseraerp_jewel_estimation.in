import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

export const PrintModule2 = (
  localIp,
  est,
  tagNo,
  userName,
  barCodeData,
  stonesData,
  totalPcs,
  totalGwt,
  totalNwt,
  totalAmt,
  totalGstAmt,
  grandTotalAmount,
  gstNo,
  loginName,
  printModel,
  customerName,
  customerMobile,
  customerArea,
  wastageData,
  mcData,
  totalAmounts,
  wastMc,
  wastValue,
) => {
  const formatNum = (val, dec = 2) =>
    Number(val || 0)
      .toFixed(dec)
      .replace(/\.00$/, "");

  let htmlContent = `
  <html>
    <head>
      <title>Estimation Receipt</title>
      <style>
        body {
          font-family: monospace;
          font-size: 12px;
          width: 90mm;
          margin: 0 auto;
          padding: 6px;
          color: #000;
        }
        h1 {
          text-align: center;
          margin: 0 0 5px 0;
          font-size: 20px;
          letter-spacing: 1px;
        }
           h5 {
          text-align: center;
          margin: 10px 0 5px 0;
          font-size: 13px;
          letter-spacing: 1px;
        }
        .line {
          border-top: 1px dashed #000;
          margin: 4px 0;
        }
        .bold { font-weight: bold; }
        .right { text-align: right; }
        .row-line {
          display: flex;
          justify-content: space-between;
          padding: 1px 0;
        }
        .row-line span:first-child { flex: 1; }
        .row-line span:last-child { text-align: left; min-width: 60px; }
        .item { margin-bottom: 6px; }
        .footer-row {
          display: flex;
          font-family: "Courier New", monospace;
          font-size: 12px;
          padding: 2px 0;
        }
        .footer-label {
          width: 130px;
          text-align: left;
          font-size: 16px;
          font-weight: bold;
        }
        .footer-colon {
          flex: 0 0 10px;
          text-align: center;
        }
        .footer-value {
          flex: 1;
          text-align: left;
          min-width: 50px;
          font-size: 16px;
        }
          .footer-line {
          flex: 1;
          text-align: left;
          min-width: 50px;
          font-size: 10px;
        }
          .data-row {
          display: flex;
          font-family: "Courier New", monospace;
          font-size: 14px;
          padding: 2px 0;
        }
        .data-label {
          width: 130px;
          text-align: left;
          font-size: 14px;
          font-weight: bold;
        }
          
        .data-colon {
          flex: 0 0 10px;
          text-align: center;
        }
        .data-value {
          flex: 1;
          text-align: right;
          min-width: 50px;
          font-size: 16px;
          font-weight: bold;
        }
          .data-value1 {
          flex: 1;
          text-align: left;
          min-width: 50px;
          font-size: 16px;
        }
          .total-label {
          width: 130px;
          text-align: left;
          font-size: 25px;
        }
          .total-value {
          flex: 1;
          text-align: right;
          min-width: 50px;
          font-size: 25px;
          font-weight: bold;
        }
           .tot-row {
      display: flex;
      justify-content: space-between;
    }
    .tot-label {
      min-width: 63px;
      text-align: left;
    }
    .tot-colon {
      padding: 0 3px;
    }
    .tot-value {
      text-align: right;
      flex: 1;
    }
          .row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-family: monospace;
      margin: 3px 0;
    }
    .col {
      width: 48%;
    }
      </style>
    </head>
    <body>
      <h1>ESTIMATION</h1>
      <div class="line"></div>
      <div><b>EST NO :</b> <span style="font-size: 18px; font-weight: bold;">${tagNo ? tagNo : est}</span></div>
      <div class="line"></div>
      <div class="bold" style="display:flex; justify-content:space-between;">
        <span>Description</span><span>Amount</span>
      </div>
      <div class="line"></div>
  `;

  barCodeData.forEach((item) => {
    const tag = item?.TAGNO || "-";
    const purity = item?.PREFIX || "";
    const rate = Number(item?.RATE ?? 0);
    let matchedW;
    let matchedMc;
    let matchedStones;
    let matchedTotal;
    if (item.TAGNO > 0) {
      matchedW = wastageData.find((w) => w.TAGNO === item?.TAGNO);
      matchedMc = mcData.find((mc) => mc.TAGNO === item?.TAGNO);
      matchedTotal = totalAmounts.find((tot) => tot.TAGNO === item.TAGNO);
      matchedStones = stonesData.filter((stone) => stone.TAGNO === item.TAGNO);
    } else {
      matchedW = wastageData.find(
        (item) => item.ISSBRANCHNAME === item?.ISSBRANCHNAME,
      );
      matchedMc = mcData.find(
        (item) => item.ISSBRANCHNAME === item.ISSBRANCHNAME,
      );
      matchedStones = stonesData.filter(
        (item) => item.ISSBRANCHNAME === item?.ISSBRANCHNAME,
      );
      matchedTotal = totalAmounts.find(
        (tot) => tot.ISSBRANCHNAME === item.ISSBRANCHNAME,
      );
    }

    const totalCts = matchedStones.reduce(
      (sum, item) => sum + (parseFloat(item.CTS) || 0),
      0,
    );
    const totalGrams = matchedStones.reduce(
      (sum, item) => sum + (parseFloat(item.GRMS) || 0),
      0,
    );
    const totalItemAmt = matchedStones.reduce(
      (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
      0,
    );
    const ctsData = totalCts / 5 + totalGrams;
    const netWt = item?.GWT - ctsData;
    const netWeight = netWt ?? item?.NWT ?? 0;

    const nwt = Number(netWt ?? item?.NWT ?? 0);
    const gwt = Number(item?.GWT ?? 0);
    const swt = Number(ctsData ?? item?.stonewt ?? 0);
    const wastageValue = matchedW?.WASTAGE ?? item?.WASTAGE ?? 0;
    const wastAmt = Number(matchedW?.TOTALWT ?? item?.CATTOTWAST ?? 0);
    const mcAmt = Number(matchedMc?.TOTALAMT ?? item?.CATTOTMC ?? 0);
    const mcgValue = matchedMc?.MAKINGCHARGES ?? item?.MAKINGCHARGES ?? 0;
    const totalAmtValue = matchedTotal?.TOTALAMT ?? 0;
    const amtValue = (nwt + wastAmt) * rate;
    const totalValue = rate * nwt;
    const totWt = Number(netWeight) + Number(wastAmt);
    const piecesText = item.PIECES
      ? ` - ${item.PIECES} ${item.PIECES > 1 ? "Pieces" : "Piece"}`
      : "";

    htmlContent += `
      <div class="item">
        <div style="display:flex; justify-content:space-between; margin-top:5px;">
          <span style="font-size: 16px; font-weight: bold;"><b>${tag}</b> ${purity}</span>
          <span style="font-size: 16px; font-weight: bold;">Rate : ${formatNum(
            rate,
          )}</span>
        </div>
       <div style="display:flex; justify-content:space-between; margin-top:5px; margin-bottom:10px"><span><b>${
         item.PRODUCTNAME
       }</b> ${piecesText}</span></div>
</div>
    </span></div>
        <div class="data-row"><span class="data-label">GROSS WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(
          gwt,
          3,
        )}</span></div>
         <div class="data-row"><span class="data-label">STONE LESS</span><span class="data-colon">:</span><span class="data-value">${formatNum(
           swt,
           3,
         )}</span></div>
         <div class="data-row"><span class="data-label">NWT WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(
           nwt,
           3,
         )}</span></div>
    `;

    if (Number(printModel) === 3) {
      htmlContent += `
       <div class="data-row"><span class="data-label">METAL VALUE</span><span class="data-colon">:</span><span class="data-value">${formatNum(
         totalValue,
       )}</span></div>
        ${
          ["W", "ALL"].includes(wastMc)
            ? `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value1"> ${wastageValue}%</span><span class="data-value">${formatNum(
                wastAmt,
                3,
              )}</span></div>`
            : `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value">${formatNum(
                wastAmt,
                3,
              )}</span></div>`
        }
      `;
    } else if (Number(printModel) === 4) {
      htmlContent += `
      <div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value">${
        Number(gwt) > 8 ? wastageValue + "%" : formatNum(wastAmt, 3)
      }</span></div>
      `;
    } else {
      htmlContent += `
        ${
          ["W", "ALL"].includes(wastMc)
            ? `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value1"> ${wastageValue}%</span><span class="data-value">${formatNum(
                wastAmt,
                3,
              )}</span></div>`
            : `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value">${formatNum(
                wastAmt,
                3,
              )}</span></div>`
        }
        <div class="data-row"><span class="data-label">TOTAL WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(
          totWt,
          3,
        )}</span></div>
        <div class="data-row"><span class="data-label">AMOUNT</span><span class="data-colon">:</span><span class="data-value">${formatNum(
          amtValue,
        )}</span></div>
      `;
    }
    if (Number(printModel) === 4) {
      htmlContent += `
       <div class="data-row"><span class="data-label">MAKING CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(
         mcAmt,
       )}</span></div>
        <div class="data-row"><span class="data-label">STONE CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(
          totalItemAmt ?? item?.ITEM_TOTAMT,
        )}</span></div>
      `;
    } else {
      htmlContent += `
      ${
        ["M", "ALL"].includes(wastMc)
          ? `<div class="data-row"><span class="data-label">MAKING CHARGES</span><span class="data-colon">:</span><span class="data-value1"> ${mcgValue}/g</span><span class="data-value">${formatNum(
              mcAmt,
            )}</span></div>`
          : `<div class="data-row"><span class="data-label">MAKING CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(
              mcAmt,
            )}</span></div>`
      }
      <div class="data-row"><span class="data-label">STONE CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(
        totalItemAmt ?? item?.ITEM_TOTAMT,
      )}</span></div>
    `;
    }
    matchedStones.forEach((s) => {
      const pcsStr = s?.NOPCS && s.NOPCS > 0 ? ` (${s.NOPCS}P)` : "";
      const weightLabel = s.CTS ? "CTS" : "GMS";

      // Fixed-width formatted layout (like printed bill)
      if (Number(printModel) === 2) {
        htmlContent += `
     <div class="row-line" style="font-size:9px; font-family:monospace; margin-left:10px;">
        <span style="display:inline-block; width:80px;">${s.ITEMNAME}</span> :
        <span style="display:inline-block; width:80px; text-align:right;">${formatNum(
          s.CTS ? s.CTS : s.GRMS,
          3,
        )}</span>
        <span style="display:inline-block; width:25px;">${weightLabel}</span>
        <span style="display:inline-block; width:40px; text-align:left; margin-left: 2px;">${pcsStr}</span>
      </div>
    `;
      } else {
        htmlContent += `
      <div class="row-line" style="font-size:9px; font-family:monospace; margin-left:10px;">
        <span style="display:inline-block; width:80px;">${s.ITEMNAME}</span> :
        <span style="display:inline-block; width:80px; text-align:right;">${formatNum(
          s.CTS ? s.CTS : s.GRMS,
          3,
        )}</span>
        <span style="display:inline-block; width:25px;">${weightLabel}</span>
        <span style="display:inline-block; width:8px;">X</span>
        <span style="display:inline-block; width:40px; text-align:right;">${formatNum(
          s.RATE,
        )}</span>
        <span style="display:inline-block; width:8px;">=</span>
        <span style="display:inline-block; width:40px; text-align:right;">${formatNum(
          s.AMOUNT,
        )}</span>
        <span style="display:inline-block; width:40px; text-align:left; margin-left: 2px;">${pcsStr}</span>
      </div>
    `;
      }
    });

    htmlContent += `
      <div class="data-row bold" style="font-size:18px; margin-bottom: 15px;">
      <span class="data-label">TOTAL VALUE</span><span class="data-colon">:</span><span class="data-value">${formatNum(
        totalAmtValue,
        0,
      )}/-</span>
    </div>
    `;
  });

  // Footer summary
  htmlContent += `
    <div class="line"></div>

    <div class="row">
        <div class="col">
        <div class="tot-row"><span class="tot-label">Tot Pcs</span><span class="tot-colon">:</span><span class="tot-value">${totalPcs}</span></div>
        <div class="tot-row"><span class="tot-label">Gross Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalGwt,
          3,
        )}</span></div>
        <div class="tot-row"><span class="tot-label">Net Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalNwt,
          3,
        )}</span></div>
        </div>

        <div class="col">
        <div class="tot-row"><span class="tot-label">Amount</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalAmt,
        )}</span></div>
        <div class="tot-row"><span class="tot-label"></span><span class="tot-colon"></span><span class="tot-value"></span></div>
        ${
          gstNo > 0
            ? `<div class="tot-row"><span class="tot-label">GST@${gstNo}%</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
                totalGstAmt,
              )}</span></div>`
            : ""
        }
        </div>
    </div>

    <div class="line"></div>

    <div class="data-row bold" style="font-size:18px;">
      <span class="total-label">TOTAL</span><span class="data-colon">:</span><span class="total-value">${formatNum(
        grandTotalAmount,
        0,
      )}/-</span>
    </div>

    <div class="line"></div>

    <h5>***Settlement Amount***</h5>

  <div class="footer-row"><span class="footer-label">Cash</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label">Card/Online</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label">Upi/Qr</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label">OG/SR</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label">RB/Due</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label">Advance</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label">Scheme</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label bold">Total</span><span class="footer-colon">:</span><span class="footer-line bold">_________________________________</span></div>

  <h5>*** VALID FOR ONE HOUR ONLY ***</h5>

  <div style="display:flex; justify-content:center; margin:6px 0;">
    <span style="margin-right:20px;">New Customer { }</span>
    <span>Existing Customer { }</span>
  </div>

  <div class="footer-row"><span class="footer-label">Mobile No</span><span class="footer-colon">:</span><span class="footer-value">${
    customerMobile || ""
  }</span></div>
  <div class="footer-row"><span class="footer-label">Name</span><span class="footer-colon">:</span><span class="footer-value">${
    customerName || ""
  }</span></div>
  <div class="footer-row"><span class="footer-label">City</span><span class="footer-colon">:</span><span class="footer-value">${
    customerArea || ""
  }</span></div>
  <div class="footer-row"><span class="footer-label">Address</span><span class="footer-colon">:</span><span class="footer-value"></span></div>
  <div class="footer-row"><span class="footer-label">Address2</span><span class="footer-colon">:</span><span class="footer-value"></span></div>
  <div class="footer-row"><span class="footer-label">Address3</span><span class="footer-colon">:</span><span class="footer-value"></span></div>
  <div class="footer-row"><span class="footer-label">Address4</span><span class="footer-colon">:</span><span class="footer-value"></span></div>

  <div class="line"></div>

    <div class="footer-row"><span class="footer-label">Date</span><span class="footer-colon">:</span><span class="footer-value">${dayjs().format(
      "DD-MM-YYYY hh:mm A",
    )}</span></div>
    <div class="footer-row"><span class="footer-label">User Name</span><span class="footer-colon">:</span><span class="footer-value">${loginName}</span></div>
  `;

  htmlContent += `
      </body>
    </html>
  `;

  const opt = {
    margin: 0,
    filename: `Estimation_${tagNo ? tagNo : est}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: [90, 297], orientation: "portrait" },
  };

  html2pdf().from(htmlContent).set(opt).save();
};
