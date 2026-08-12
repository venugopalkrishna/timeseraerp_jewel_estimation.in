import dayjs from "dayjs";

export const printReceipt = (
  printerIP,
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
  var printer = null;
  var ePosDev = new window.epson.ePOSDevice();

  ePosDev.connect(printerIP, 8008, cbConnect);
  // ePosDev.connect(printerIP, 8043, cbConnect, { secure: true });

  function cbConnect(data) {
    if (data === "OK") {
      ePosDev.createDevice(
        "local_printer",
        ePosDev.DEVICE_TYPE_PRINTER,
        { crypto: true, buffer: false },
        cbCreateDevice_printer,
      );
    } else {
      console.log("Connection failed:", data);
    }
  }

  function cbCreateDevice_printer(devobj, retcode) {
    if (retcode === "OK") {
      printer = devobj;
      executeAddedCode();
    } else {
      console.log("Device create failed:", retcode);
    }
  }

  function executeAddedCode() {
    const lineWidth = 48;
    printer.addTextAlign(printer.ALIGN_CENTER);
    printer.addFeedLine(1);
    printer.addTextSize(2, 1);
    // const img = new Image();
    // img.src = base64Images;

    // img.onload = function () {
    //   // === LOGO ===
    //   const canvas = document.createElement("canvas");
    //   const ctx = canvas.getContext("2d");

    //   const targetWidth = 200; // pixels (adjust for your logo size)
    //   const aspectRatio = img.width / img.height;
    //   const targetHeight = Math.round(targetWidth / aspectRatio);

    //   // Set canvas size
    //   canvas.width = targetWidth;
    //   canvas.height = targetHeight;

    //   // Draw image on canvas
    //   ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    //   // === LOGO ===
    //   printer.addImage(
    //     ctx,
    //     0,
    //     0,
    //     targetWidth,
    //     targetHeight,
    //     printer.COLOR_1,
    //     printer.MODE_MONO,
    //     printer.HALFTONE_DITHER,
    //     1
    //   );
    printer.addText(storeDetails?.FIRMNAME + "\n");
    printer.addTextSize(1, 1);
    printer.addText(storeDetails?.ADD1 + "\n");
    printer.addText(storeDetails?.ADD2 + "\n");
    printer.addText(storeDetails?.FMOBILE + "\n");
    printer.addFeedLine(1);
    printer.addTextSize(2, 2); // Large font
    printer.addText("PURCHASE ESTIMATION \n");
    printer.addTextSize(1, 1); // Reset font size

    // printer.addText(address + "\n");
    // printer.addText(address1 + "\n");
    // printer.addText("PHONE NO: " + userPhone + "\n");
    // printer.addText("GSTIN: " + gstNo + "\n");
    printer.addFeedLine(1);

    // ==== TITLE ====
    printer.addTextFont(printer.FONT_B);
    printer.addTextAlign(printer.ALIGN_LEFT);
    printer.addTextSize(2, 1);
    // printer.addTextStyle(true, false, true, printer.COLOR_3);
    printer.addText("EST NO :" + " " + EstNo + "\n");
    // printer.addTextStyle(false, false, false, printer.COLOR_BLACK);
    printer.addFeedLine(1);
    printer.addTextFont(printer.FONT_A);
    printer.addTextSize(1, 1);

    // ==== INVOICE INFO ====
    // const invLabel = "INV NO   : ";
    // // const invValue = String(invNo ? invNo : invoiceNo + 1);
    // const invText = invLabel + invValue.padEnd(9, " ");

    // const dateLabel = "DATE : ";
    // const dateValue = dayjs().format("DD-MMM-YYYY hh:mm A");
    // const dateText = dateLabel + dateValue.padStart(11, " ");

    // const spaceCounts = lineWidth - (invText.length + dateText.length);
    // const space = " ".repeat(spaceCounts > 0 ? spaceCounts : 1);

    // const line1 = invText + space + dateText;

    // printer.addText(line1 + "\n");

    printer.addTextAlign(printer.ALIGN_LEFT);
    // printer.addText(line1 + "\n");
    // printer.addText("MOBILE   : " + (customerMobile || "-") + "\n");
    // printer.addText("CUST NAME: " + (customerName || "-") + "\n");
    printer.addText("------------------------------------------------\n");

    // ==== TABLE HEADER ====
    // printer.addTextStyle(true, false, false, printer.COLOR_BLACK);
    // printer.addTextFont(printer.FONT_C);
    // printer.addTextSize(2, 1);
    printer.addText("Description                               AMOUNT\n");
    // printer.addTextStyle(false, false, false, printer.COLOR_BLACK);
    // printer.addTextFont(printer.FONT_A);
    // printer.addTextSize(1, 1);
    printer.addText("------------------------------------------------\n");

    // ==== ITEMS ====
    data.forEach((item, index) => {
      const tag = (item.sno ?? "").toString().padEnd(10, " "); // SNO column
      const mainProduct = `${item.mainProduct ?? ""}`.padStart(27, " ");
      const productName = `${item.productName ?? ""}`.padStart(27, " ");

      const gwt = `${Number(item.gwt ?? 0).toFixed(3)}`.padStart(27, " ");
      const touch = `${item.touch ?? 0}%`.padStart(20, " ");
      const nwt = `${Number(item.nwt ?? 0).toFixed(3)}`.padStart(27, " ");

      const totalAmt = `${Number(item.total ?? 0).toFixed(2)}`.padStart(
        27,
        " ",
      );

      const rate = `${Number(item.rate ?? 0).toFixed(0)}`.padStart(27, " ");
      const amount = `${Number(item.amount ?? 0).toFixed(0)}`.padStart(27, " ");
      const other = `${Number(item.others ?? 0).toFixed(3)}`.padStart(27, " ");
      // Main row (aligned with header)
      printer.addTextFont(printer.FONT_B);
      printer.addTextAlign(printer.ALIGN_LEFT);
      printer.addTextSize(2, 1);
      printer.addText(tag);
      printer.addTextFont(printer.FONT_A);

      // Second row: Product Name + HSN + SMCODE + GST
      printer.addTextSize(1, 1);

      printer.addText(`    MAIN PRODUCT   : ${mainProduct}\n`);
      printer.addText(`    PRODUCT NAME   : ${productName}\n`);
      printer.addText(`    GROSS WEIGHT   : ${gwt}\n`);
      printer.addText(`    TOUCH          : ${touch}\n`);
      printer.addText(`    NET WEIGHT     : ${nwt}\n`);
      printer.addText(`    RATE           : ${rate}\n`);
      printer.addText(`    AMOUNT         : ${amount}\n`);
      printer.addText(`    OTHER CHARGES  : ${other}\n`);

      printer.addFeedLine(1);
      printer.addText(`    TOTAL VALUE    : ${totalAmt}\n`);
      // Third row: MRP + OFFER
      // printer.addText(
      //   `    MRP:${item.CPrice?.toFixed(2) || "0.00"}        OFFER:${
      //     item?.offer?.toFixed(2) || "0.00"
      //   }\n`
      // );

      // Separator
      printer.addFeedLine(1);
    });
    printer.addText("------------------------------------------------\n");

    // Tot Pcs and Amount in the same line
    const leftLabel1 = "Tot items : ";
    const leftValue1 = String(data?.length ?? 0);
    const leftText1 = leftLabel1 + leftValue1;

    const rightLabel1 = "Amount : ";
    const rightValue1 = netAmt.toFixed(2);
    const rightText1 = rightLabel1 + rightValue1;

    let spaceCount1 = lineWidth - (leftText1.length + rightText1.length);
    let spaces1 = " ".repeat(spaceCount1 > 0 ? spaceCount1 : 1);

    printer.addText(leftText1 + spaces1 + rightText1 + "\n");

    // Gross Wt alone on left side
    printer.addText("Gross Wt : " + Number(totals.gwt).toFixed(3) + "\n");

    // Net Wt and GST in the same line
    const leftLabel2 = "Net Wt   : ";
    const leftValue2 = Number(totals.nwt).toFixed(3);
    const leftText2 = leftLabel2 + leftValue2;

    let rightText2 = "";

    // if (Number(gstNo) > 0) {
    //   const rightLabel2 = `GST@${gstNo}% : `;
    //   const rightValue2 = totalGstAmt.toFixed(2);
    //   rightText2 = rightLabel2 + rightValue2;
    // }

    let spaceCount2 = lineWidth - (leftText2.length + rightText2.length);
    let spaces2 = " ".repeat(spaceCount2 > 0 ? spaceCount2 : 1);

    printer.addText(leftText2 + spaces2 + rightText2 + "\n");
    printer.addText("------------------------------------------------\n");
    printer.addTextFont(printer.FONT_B);
    printer.addTextAlign(printer.ALIGN_RIGHT);
    printer.addTextSize(2, 1);
    const totalValue = Number(netAmt).toFixed(2);
    printer.addText("TOTAL :" + " " + totalValue + "/-" + "\n");
    printer.addFeedLine(1);
    printer.addTextFont(printer.FONT_A);
    printer.addTextSize(1, 1);
    // printer.addTextAlign(printer.ALIGN_CENTER);
    // printer.addText("***Settlement Amount***\n");
    // printer.addTextAlign(printer.ALIGN_LEFT);
    // const lineLength = 42;
    // function formatLine(label) {
    //   const labelWithColon = label.padEnd(14, " ") + ":"; // label + colon
    //   const remainingSpace = lineLength - labelWithColon.length;
    //   return labelWithColon + "_".repeat(remainingSpace) + "\n";
    // }
    // printer.addText(formatLine("Cash"));
    // printer.addText(formatLine("Card/Online"));
    // printer.addText(formatLine("Upi/Qr"));
    // printer.addText(formatLine("OG/SR"));
    // printer.addText(formatLine("RB/Due"));
    // printer.addText(formatLine("Advance"));
    // printer.addText(formatLine("Scheme"));
    // printer.addText(formatLine("Total"));
    // printer.addTextAlign(printer.ALIGN_CENTER);
    // printer.addText("*** VALID FOR ONE HOUR ONLY ***\n");
    // printer.addTextAlign(printer.ALIGN_LEFT);
    // printer.addText("New Customer    {   }  Existing Customer {   }\n");
    // printer.addText("Mobile No  : \n");
    // printer.addText("Name       : \n");
    // printer.addText("City       : \n");
    // printer.addText("Address    : \n");
    // printer.addText("Address2   : \n");
    // printer.addText("Address3   : \n");
    // printer.addText("Address4   : \n");
    printer.addFeedLine(1);

    printer.addTextAlign(printer.ALIGN_LEFT);
    printer.addText(`Name      : ${customerName}\n`);
    printer.addText(`Mobile No : ${customerMobile}\n`);
    printer.addText(`City      : ${customerArea}\n`);
    printer.addText("------------------------------------------------\n");
    printer.addFeedLine(1);
    printer.addText(`Date      : ${dayjs().format("DD-MM-YYYY hh:mm A")}\n`);
    printer.addText(`User Name : ${loginName}\n`);
    printer.addFeedLine(2);
    printer.addCut(printer.CUT_FEED);

    // ---- SEND TO PRINTER ----
    printer.send();
    // };
  }
};
