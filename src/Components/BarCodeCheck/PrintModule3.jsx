import dayjs from "dayjs";

export const PrintModule3 = (
  localIp,
  EstNo,
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
  wastPer,
  stoneItemsData,
) => {
  const formatNum = (val, dec = 2) =>
    Number(val || 0)
      .toFixed(dec)
      .replace(/\.00$/, "");
  const toNumber = (val) => Number(val) || 0;

  // ── Build receipt body HTML ──────────────────────────────────────────────
  let bodyHtml = `
    <h1>ESTIMATION</h1>
    <div class="line"></div>
    <div><b>EST NO :</b> <span style="font-size:18px;font-weight:bold;">${EstNo}</span></div>
    <div class="line"></div>
    <div class="bold" style="display:flex;justify-content:space-between;">
      <span>Description</span><span>Amount</span>
    </div>
    <div class="line"></div>
  `;

  barCodeData.forEach((item) => {
    const tag = item?.TAGNO || "-";
    const purity = item?.PREFIX || "";
    const rate = Number(item?.RATE ?? 0);

    let matchedW, matchedMc, matchedStones, matchedTotal;

    if (item.TAGNO > 0) {
      matchedW = wastageData.find((w) => w.TAGNO === item?.TAGNO);
      matchedMc = mcData.find((mc) => mc.TAGNO === item?.TAGNO);
      matchedTotal = totalAmounts.find((tot) => tot.TAGNO === item.TAGNO);
      matchedStones = stonesData.filter((stone) => stone.TAGNO === item.TAGNO);
    } else {
      matchedW = wastageData.find(
        (w) => w.ISSBRANCHNAME === item?.ISSBRANCHNAME,
      );
      matchedMc = mcData.find((mc) => mc.ISSBRANCHNAME === item?.ISSBRANCHNAME);
      matchedStones = stonesData.filter(
        (s) => s.ISSBRANCHNAME === item?.ISSBRANCHNAME,
      );
      matchedTotal = totalAmounts.find(
        (tot) => tot.ISSBRANCHNAME === item.ISSBRANCHNAME,
      );
    }

    const totalItemAmt = matchedStones.reduce(
      (sum, s) => sum + (parseFloat(s.AMOUNT) || 0),
      0,
    );

    const stoneWeight = matchedStones.reduce((sum, stone) => {
      const cts = toNumber(stone?.CTS);
      const grams = toNumber(stone?.GRMS);
      const matchedItem = stoneItemsData?.find(
        (si) => si.ITEMNAME === stone.ITEMNAME,
      );
      const shouldDivide =
        matchedItem?.EFFECTON_DIAMOND === true ||
        matchedItem?.EFFECTON_GOLD === true;
      return sum + (shouldDivide ? cts / 5 : 0) + (shouldDivide ? grams : 0);
    }, 0);

    const beads = Number(item?.BSWT) || 0;
    const ctsData = Number(stoneWeight) + Number(beads) || 0;
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

    bodyHtml += `
      <div class="item">
        <div style="display:flex;justify-content:space-between;margin-top:5px;">
          <span style="font-size:16px;font-weight:bold;"><b>${tag}</b> ${purity}</span>
          <span style="font-size:16px;font-weight:bold;">Rate : ${formatNum(rate)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:5px;margin-bottom:10px;">
          <span><b>${item.PRODUCTNAME}</b> ${piecesText}</span>
        </div>
      </div>
      <div class="data-row"><span class="data-label">GROSS WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(gwt, 3)}</span></div>
      <div class="data-row"><span class="data-label">STONE LESS</span><span class="data-colon">:</span><span class="data-value">${formatNum(swt, 3)}</span></div>
      <div class="data-row"><span class="data-label">NWT WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(nwt, 3)}</span></div>
    `;

    if (Number(printModel) === 3) {
      bodyHtml += `
        <div class="data-row">
          <span class="data-label">METAL VALUE</span>
          <span class="data-colon">:</span>
          <span class="data-value">${formatNum(totalValue)}</span>
        </div>
        ${
          Number(wastPer) === 2
            ? `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value">${wastageValue}%</span></div>`
            : ["W", "ALL"].includes(wastMc)
              ? `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value1"> ${wastageValue}%</span><span class="data-value">${formatNum(wastAmt, 3)}</span></div>`
              : `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value">${formatNum(wastAmt, 3)}</span></div>`
        }
      `;
    } else if (Number(printModel) === 4) {
      bodyHtml += `
        <div class="data-row">
          <span class="data-label">${wastValue}</span>
          <span class="data-colon">:</span>
          <span class="data-value">${
            Number(gwt) > 8 ? wastageValue + "%" : formatNum(wastAmt, 3)
          }</span>
        </div>
      `;
    } else {
      bodyHtml += `
        ${
          Number(wastPer) === 2
            ? `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value">${wastageValue}%</span></div>`
            : ["W", "ALL"].includes(wastMc)
              ? `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value1"> ${wastageValue}%</span><span class="data-value">${formatNum(wastAmt, 3)}</span></div>`
              : `<div class="data-row"><span class="data-label">${wastValue}</span><span class="data-colon">:</span><span class="data-value">${formatNum(wastAmt, 3)}</span></div>`
        }
        <div class="data-row"><span class="data-label">TOTAL WEIGHT</span><span class="data-colon">:</span><span class="data-value">${formatNum(totWt, 3)}</span></div>
        <div class="data-row"><span class="data-label">AMOUNT</span><span class="data-colon">:</span><span class="data-value">${formatNum(amtValue)}</span></div>
      `;
    }

    if (Number(printModel) === 4) {
      bodyHtml += `
        <div class="data-row"><span class="data-label">MAKING CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(mcAmt)}</span></div>
        <div class="data-row"><span class="data-label">STONE CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(totalItemAmt ?? item?.ITEM_TOTAMT)}</span></div>
      `;
    } else {
      bodyHtml += `
        ${
          ["M", "ALL"].includes(wastMc)
            ? `<div class="data-row"><span class="data-label">MAKING CHARGES</span><span class="data-colon">:</span><span class="data-value1"> ${mcgValue}/g</span><span class="data-value">${formatNum(mcAmt)}</span></div>`
            : `<div class="data-row"><span class="data-label">MAKING CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(mcAmt)}</span></div>`
        }
        <div class="data-row"><span class="data-label">STONE CHARGES</span><span class="data-colon">:</span><span class="data-value">${formatNum(totalItemAmt ?? item?.ITEM_TOTAMT)}</span></div>
      `;
    }

    matchedStones.forEach((s) => {
      const pcsStr = s?.NOPCS && s.NOPCS > 0 ? ` (${s.NOPCS}P)` : "";
      const weightLabel = s.CTS ? "CTS" : "GMS";

      if (Number(printModel) === 2) {
        bodyHtml += `
          <div class="row-line" style="font-size:9px;font-family:monospace;margin-left:10px;">
            <span style="display:inline-block;width:80px;">${s.ITEMNAME}</span> :
            <span style="display:inline-block;width:80px;text-align:right;">${formatNum(s.CTS ? s.CTS : s.GRMS, 3)}</span>
            <span style="display:inline-block;width:25px;">${weightLabel}</span>
            <span style="display:inline-block;width:40px;text-align:left;margin-left:2px;">${pcsStr}</span>
          </div>
        `;
      } else {
        bodyHtml += `
          <div class="row-line" style="font-size:9px;font-family:monospace;margin-left:10px;">
            <span style="display:inline-block;width:80px;">${s.ITEMNAME}</span> :
            <span style="display:inline-block;width:80px;text-align:right;">${formatNum(s.CTS ? s.CTS : s.GRMS, 3)}</span>
            <span style="display:inline-block;width:25px;">${weightLabel}</span>
            <span style="display:inline-block;width:8px;">X</span>
            <span style="display:inline-block;width:40px;text-align:right;">${formatNum(s.RATE)}</span>
            <span style="display:inline-block;width:8px;">=</span>
            <span style="display:inline-block;width:40px;text-align:right;">${formatNum(s.AMOUNT)}</span>
            <span style="display:inline-block;width:40px;text-align:left;margin-left:2px;">${pcsStr}</span>
          </div>
        `;
      }
    });

    bodyHtml += `
      <div class="data-row bold" style="font-size:18px;margin-bottom:15px;">
        <span class="data-label">TOTAL VALUE</span>
        <span class="data-colon">:</span>
        <span class="data-value">${formatNum(totalAmtValue, 0)}/-</span>
      </div>
    `;
  });

  bodyHtml += `
    <div class="line"></div>
    <div class="row">
      <div class="col">
        <div class="tot-row"><span class="tot-label">Tot Pcs</span><span class="tot-colon">:</span><span class="tot-value">${totalPcs}</span></div>
        <div class="tot-row"><span class="tot-label">Gross Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(totalGwt, 3)}</span></div>
        <div class="tot-row"><span class="tot-label">Net Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(totalNwt, 3)}</span></div>
      </div>
      <div class="col">
        <div class="tot-row"><span class="tot-label">Amount</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(totalAmt)}</span></div>
        <div class="tot-row"><span class="tot-label"></span><span class="tot-colon"></span><span class="tot-value"></span></div>
        ${
          gstNo > 0
            ? `<div class="tot-row"><span class="tot-label">GST@${gstNo}%</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(totalGstAmt)}</span></div>`
            : ""
        }
      </div>
    </div>
    <div class="line"></div>
    <div class="data-row bold" style="font-size:18px;">
      <span class="total-label">TOTAL</span>
      <span class="data-colon">:</span>
      <span class="total-value">${formatNum(grandTotalAmount, 0)}/-</span>
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
    <div style="display:flex;justify-content:center;margin:6px 0;">
      <span style="margin-right:20px;">New Customer { }</span>
      <span>Existing Customer { }</span>
    </div>
    <div class="footer-row"><span class="footer-label">Mobile No</span><span class="footer-colon">:</span><span class="footer-value">${customerMobile || ""}</span></div>
    <div class="footer-row"><span class="footer-label">Name</span><span class="footer-colon">:</span><span class="footer-value">${customerName || ""}</span></div>
    <div class="footer-row"><span class="footer-label">City</span><span class="footer-colon">:</span><span class="footer-value">${customerArea || ""}</span></div>
    <div class="footer-row"><span class="footer-label">Address</span><span class="footer-colon">:</span><span class="footer-value"></span></div>
    <div class="footer-row"><span class="footer-label">Address2</span><span class="footer-colon">:</span><span class="footer-value"></span></div>
    <div class="footer-row"><span class="footer-label">Address3</span><span class="footer-colon">:</span><span class="footer-value"></span></div>
    <div class="footer-row"><span class="footer-label">Address4</span><span class="footer-colon">:</span><span class="footer-value"></span></div>
    <div class="line"></div>
    <div class="footer-row"><span class="footer-label">Date</span><span class="footer-colon">:</span><span class="footer-value">${dayjs().format("DD-MM-YYYY hh:mm A")}</span></div>
    <div class="footer-row"><span class="footer-label">User Name</span><span class="footer-colon">:</span><span class="footer-value">${loginName}</span></div>
  `;

  // ── Shared CSS ───────────────────────────────────────────────────────────
  const styles = `
    @media print {
      @page { size: 90mm auto; margin: 0; }
      body  { margin: 0; padding: 0; }
    }
    body {
      font-family: monospace; font-size: 12px;
      width: 90mm; margin: 0 auto; padding: 6px;
      color: #000; background: #fff;
    }
    h1 { text-align:center; margin:0 0 5px 0; font-size:20px; letter-spacing:1px; }
    h5 { text-align:center; margin:10px 0 5px 0; font-size:13px; letter-spacing:1px; }
    .line   { border-top:1px dashed #000; margin:4px 0; }
    .bold   { font-weight:bold; }
    .right  { text-align:right; }
    .row-line { display:flex; justify-content:space-between; padding:1px 0; }
    .row-line span:first-child { flex:1; }
    .row-line span:last-child  { text-align:left; min-width:60px; }
    .item { margin-bottom:6px; }
    .footer-row   { display:flex; font-family:"Courier New",monospace; font-size:12px; padding:2px 0; }
    .footer-label { width:130px; text-align:left; font-size:16px; font-weight:bold; }
    .footer-colon { flex:0 0 10px; text-align:center; }
    .footer-value { flex:1; text-align:left; min-width:50px; font-size:16px; }
    .footer-line  { flex:1; text-align:left; min-width:50px; font-size:10px; }
    .data-row     { display:flex; font-family:"Courier New",monospace; font-size:14px; padding:2px 0; }
    .data-label   { width:130px; text-align:left; font-size:14px; font-weight:bold; }
    .data-colon   { flex:0 0 10px; text-align:center; }
    .data-value   { flex:1; text-align:right; min-width:50px; font-size:16px; font-weight:bold; }
    .data-value1  { flex:1; text-align:left; min-width:50px; font-size:16px; }
    .total-label  { width:130px; text-align:left; font-size:25px; }
    .total-value  { flex:1; text-align:right; min-width:50px; font-size:25px; font-weight:bold; }
    .tot-row  { display:flex; justify-content:space-between; }
    .tot-label { min-width:63px; text-align:left; }
    .tot-colon { padding:0 3px; }
    .tot-value { text-align:right; flex:1; }
    .row { display:flex; justify-content:space-between; font-size:13px; font-family:monospace; margin:3px 0; }
    .col { width:48%; }
  `;

  // ── Full HTML document ───────────────────────────────────────────────────
  const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>Estimation Receipt</title>
    <style>${styles}</style>
  </head>
  <body>${bodyHtml}</body>
</html>`;

  // ==========================================================================
  //  DETECT ENVIRONMENT
  //  Android WebView exposes window.Android (if bridge is set up)
  //  OR we detect via userAgent
  // ==========================================================================
  const isAndroidWebView =
    typeof window.Android !== "undefined" ||
    (/Android/.test(navigator.userAgent) &&
      !/Chrome\/[.0-9]*/.test(navigator.userAgent)) ||
    (/wv/.test(navigator.userAgent) && /Android/.test(navigator.userAgent));

  // ==========================================================================
  //  METHOD 1 — Android JS Bridge (PrintManager)
  //  Requires setup in MainActivity.java (see bottom of file)
  //  This is the ONLY reliable way to print from Android WebView
  // ==========================================================================
  const tryAndroidBridge = () => {
    try {
      // Check if Android JS bridge is available
      if (
        typeof window.Android !== "undefined" &&
        typeof window.Android.printHTML === "function"
      ) {
        // Pass the full HTML string to the native Android print function
        window.Android.printHTML(fullHtml);
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Android bridge failed:", e);
      return false;
    }
  };

  // ==========================================================================
  //  METHOD 2 — WebView printing via a dedicated full-screen WebView
  //  Works when the APK loads the HTML into a NEW WebView using PrintManager
  //  Trigger by navigating to a special URL the native app intercepts
  // ==========================================================================
  const tryUrlScheme = () => {
    try {
      if (
        typeof window.Android !== "undefined" &&
        typeof window.Android.startPrint === "function"
      ) {
        // Encode HTML and pass via URL scheme
        const encoded = btoa(unescape(encodeURIComponent(fullHtml)));
        window.Android.startPrint(encoded);
        return true;
      }
      return false;
    } catch (e) {
      console.warn("URL scheme failed:", e);
      return false;
    }
  };

  // ==========================================================================
  //  METHOD 3 — window.print() for web browser / desktop / iOS
  //  Uses a hidden iframe with Blob URL — works in real browsers
  // ==========================================================================
  const tryBrowserPrint = () => {
    try {
      const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;opacity:0;pointer-events:none;";

      iframe.onload = () => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          console.warn("iframe print failed:", e);
          // fallback: window.open
          const w = window.open(blobUrl, "_blank");
          if (w) {
            w.onload = () => {
              w.focus();
              w.print();
            };
          }
        } finally {
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            if (document.body.contains(iframe))
              document.body.removeChild(iframe);
          }, 2000);
        }
      };

      document.body.appendChild(iframe);
      iframe.src = blobUrl;
      return true;
    } catch (e) {
      console.warn("Browser print failed:", e);
      return false;
    }
  };

  // ==========================================================================
  //  METHOD 4 — CSS @media print trick (absolute last resort)
  //  Hides the entire app UI and shows only the receipt when printing
  // ==========================================================================
  const tryCssMediaTrick = () => {
    try {
      const printDiv = document.createElement("div");
      printDiv.id = "__receipt_print_area__";
      printDiv.innerHTML = bodyHtml;
      document.body.appendChild(printDiv);

      const styleEl = document.createElement("style");
      styleEl.id = "__receipt_print_style__";
      styleEl.innerHTML = `
        @media print {
          @page { size: 90mm auto; margin: 0; }
          body > *:not(#__receipt_print_area__) { display: none !important; visibility: hidden !important; }
          #__receipt_print_area__ {
            display: block !important;
            visibility: visible !important;
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 90mm; font-family: monospace;
            font-size: 12px; padding: 6px;
            color: #000; background: #fff;
          }
          ${styles}
        }
        #__receipt_print_area__ { display: none !important; }
      `;
      document.head.appendChild(styleEl);

      window.focus();
      window.print();

      setTimeout(() => {
        const d = document.getElementById("__receipt_print_area__");
        const s = document.getElementById("__receipt_print_style__");
        if (d) document.body.removeChild(d);
        if (s) document.head.removeChild(s);
      }, 3000);

      return true;
    } catch (e) {
      console.warn("CSS media trick failed:", e);
      return false;
    }
  };

  // ==========================================================================
  //  EXECUTION — pick the right method based on environment
  // ==========================================================================
  if (isAndroidWebView) {
    // Android WebView: must use native bridge — window.print() does NOT work
    if (!tryAndroidBridge()) {
      if (!tryUrlScheme()) {
        // If no bridge is set up, fall back to CSS trick (prints current page
        // but hides app UI — not ideal but visible on screen at least)
        tryCssMediaTrick();
        console.error(
          "⚠️  No Android JS bridge found. " +
            "Add window.Android.printHTML() in MainActivity.java. " +
            "See the setup instructions at the bottom of this file.",
        );
      }
    }
  } else {
    // Browser / Desktop / iOS — use Blob iframe
    if (!tryBrowserPrint()) {
      tryCssMediaTrick();
    }
  }
};

// =============================================================================
//
//  ██████╗  ███████╗  ██████╗ ██╗   ██╗██╗██████╗ ███████╗██████╗
//  ██╔══██╗ ██╔════╝ ██╔═══██╗██║   ██║██║██╔══██╗██╔════╝██╔══██╗
//  ██████╔╝ █████╗   ██║   ██║██║   ██║██║██████╔╝█████╗  ██║  ██║
//  ██╔══██╗ ██╔══╝   ██║▄▄ ██║██║   ██║██║██╔══██╗██╔══╝  ██║  ██║
//  ██║  ██║ ███████╗ ╚██████╔╝╚██████╔╝██║██║  ██║███████╗██████╔╝
//
//  ANDROID SETUP — Add this to your MainActivity.java
//  (or wherever your WebView is configured)
//
// =============================================================================
//
//  STEP 1 — Add this inner class to your Activity:
//
//    public class AndroidPrintBridge {
//        private Activity activity;
//        AndroidPrintBridge(Activity a) { this.activity = a; }
//
//        @JavascriptInterface
//        public void printHTML(String htmlContent) {
//            activity.runOnUiThread(() -> {
//                // Create a WebView just for printing
//                WebView printWebView = new WebView(activity);
//                printWebView.setWebViewClient(new WebViewClient() {
//                    @Override
//                    public boolean onPageFinished(WebView view, String url) {
//                        // Trigger Android PrintManager
//                        PrintManager printManager =
//                            (PrintManager) activity.getSystemService(Context.PRINT_SERVICE);
//                        PrintDocumentAdapter printAdapter =
//                            printWebView.createPrintDocumentAdapter("EstimationReceipt");
//                        PrintAttributes.Builder builder = new PrintAttributes.Builder();
//                        builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4);
//                        printManager.print("EstimationReceipt", printAdapter, builder.build());
//                        return false;
//                    }
//                });
//                printWebView.loadDataWithBaseURL(null, htmlContent, "text/html", "UTF-8", null);
//            });
//        }
//    }
//
//  STEP 2 — Register the bridge in your WebView setup:
//
//    WebView webView = findViewById(R.id.webview);
//    webView.getSettings().setJavaScriptEnabled(true);
//    webView.addJavascriptInterface(new AndroidPrintBridge(this), "Android");
//    webView.loadUrl("file:///android_asset/index.html"); // or your URL
//
//  STEP 3 — Add permission in AndroidManifest.xml (not needed for print,
//           but good practice):
//    (no special permission needed for PrintManager)
//
//  STEP 4 — If using React Native, use this instead of MainActivity.java:
//
//    // In your custom WebView component or patch:
//    import { WebView } from 'react-native-webview';
//
//    // Use injectedJavaScript to define the Android bridge via
//    // react-native-print or a custom native module:
//    import RNPrint from 'react-native-print';
//
//    // In your WebView onMessage handler:
//    const handleMessage = async (event) => {
//      const { type, html } = JSON.parse(event.nativeEvent.data);
//      if (type === 'PRINT') {
//        await RNPrint.print({ html });
//      }
//    };
//
//    // Then in PrintModule3.js change window.Android.printHTML(fullHtml) to:
//    // window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PRINT', html: fullHtml }));
//
// =============================================================================
