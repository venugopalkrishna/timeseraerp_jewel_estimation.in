import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

export const PrintModule2 = (
  localIp,
  EstNo,
  userName,
  loginName,
  printModel,
  customerName,
  customerMobile,
  customerArea,
  data,
  totals,
  grossAmt,
  netAmt,
  storeDetails,
) => {
  const formatNum = (val, dec = 2) =>
    Number(val || 0)
      .toFixed(dec)
      .replace(/\.00$/, "");
  const toNumber = (val) => Number(val) || 0;

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
          width: 100px;
          text-align: left;
          font-size: 16px;
          font-weight: bold;
        }
          .footer-label1 {
          width: 120px;
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
    <div style="text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 1px;">${storeDetails?.FIRMNAME}</div>
    <div style="text-align: center; font-size: 14px; letter-spacing: 1px;">${storeDetails?.ADD1}</div>
    <div style="text-align: center; font-size: 14px; letter-spacing: 1px;">${storeDetails?.ADD2}</div>
    <div style="text-align: center; font-size: 14px; letter-spacing: 1px;">PHNO:${storeDetails?.FMOBILE}</div>
      <h1>PURCHASE ESTIMATION</h1>
      <div class="line"></div>
      <div><b>EST NO :</b> <span style="font-size: 18px; font-weight: bold;">${EstNo}</span></div>
      <div class="line"></div>
      <div class="bold" style="display:flex; justify-content:space-between;">
        <span>Description</span><span>Amount</span>
      </div>
      <div class="line"></div>
  `;

  data.forEach((item) => {
    htmlContent += `
      <div class="item">
        <div style="display:flex; justify-content:space-between; margin-top:5px;">
          <span style="font-size: 16px; font-weight: bold;"><b>${item.sno}</b>
         
        </div>
      
</div>
    </span></div>
        <div class="data-row"><span class="data-label">MAIN PRODUCT</span><span class="data-colon">:</span><span class="data-value">${item.mainProduct}</span></div>
         <div class="data-row"><span class="data-label">PRODUCT NAME</span><span class="data-colon">:</span><span class="data-value">${item.productName}</span></div>
         <div class="data-row"><span class="data-label">GROSS WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(
           item.gwt,
           3,
         )}</span></div>
         <div class="data-row"><span class="data-label">TOUCH</span><span class="data-colon">:</span><span class="data-value">${item.touch}%</span></div>
         <div class="data-row"><span class="data-label">NET WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(
           item.nwt,
           3,
         )}</span></div>
         <div class="data-row"><span class="data-label">RATE</span><span class="data-colon">:</span><span class="data-value">${formatNum(
           item.rate,
         )}</span></div>
         <div class="data-row"><span class="data-label">AMOUNT</span><span class="data-colon">:</span><span class="data-value">${formatNum(
           item.amount,
         )}</span></div>
         <div class="data-row"><span class="data-label">OTHER CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(
           item.others,
         )}</span></div>
    `;

    htmlContent += `
      <div class="data-row bold" style="font-size:18px; margin-bottom: 15px;">
      <span class="data-label">TOTAL VALUE</span><span class="data-colon">:</span><span class="data-value">${formatNum(
        item.total,
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
        <div class="tot-row"><span class="tot-label">Tot Items</span><span class="tot-colon">:</span><span class="tot-value">${data.length}</span></div>
        <div class="tot-row"><span class="tot-label">Gross Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totals.gwt,
          3,
        )}</span></div>
        <div class="tot-row"><span class="tot-label">Net Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totals.nwt,
          3,
        )}</span></div>
        </div>

        <div class="col">
        <div class="tot-row"><span class="tot-label">Amount</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          netAmt,
        )}</span></div>
        <div class="tot-row"><span class="tot-label"></span><span class="tot-colon"></span><span class="tot-value"></span></div>
        <div class="tot-row"><span class="tot-label"></span><span class="tot-colon"></span><span class="tot-value"></span></div>
        </div>
    </div>

    <div class="line"></div>

    <div class="data-row bold" style="font-size:18px;">
      <span class="total-label">TOTAL</span><span class="data-colon">:</span><span class="total-value">${formatNum(
        netAmt,
        0,
      )}/-</span>
    </div>

    <div class="line"></div>

    <h5>***Settlement Amount***</h5>

  <div class="footer-row"><span class="footer-label1">Cash</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label1">Card/Online</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label1">Upi/Qr</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label1">OG/SR</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label1">RB/Due</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label1">Advance</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label1">Scheme</span><span class="footer-colon">:</span><span class="footer-line">_________________________________</span></div>
  <div class="footer-row"><span class="footer-label1 bold">Total</span><span class="footer-colon">:</span><span class="footer-line bold">_________________________________</span></div>

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
    filename: `Estimation_${EstNo}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: [90, 297], orientation: "portrait" },
  };

  html2pdf().from(htmlContent).set(opt).save();
};
