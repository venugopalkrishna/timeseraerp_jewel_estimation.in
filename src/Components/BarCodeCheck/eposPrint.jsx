import dayjs from "dayjs";

export const printReceipt = (
  printerIP,
  EstNo,
  userName,
  barCodeData,
  stonesData,
  totalPcs,
  totalGwt,
  totalNwt,
  totalAmt,
  totalGstAmt,
  grandTotalAmount
) => {
  var printer = null;
  var ePosDev = new window.epson.ePOSDevice();

  // ePosDev.connect(printerIP, 8008, cbConnect);
  ePosDev.connect(printerIP, 8043, cbConnect, { secure: true });

  function cbConnect(data) {
    if (data === "OK") {
      ePosDev.createDevice(
        "local_printer",
        ePosDev.DEVICE_TYPE_PRINTER,
        { crypto: true, buffer: false },
        cbCreateDevice_printer
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
    printer.addFeedLine(1);
    printer.addTextSize(2, 2); // Large font
    printer.addText("ESTIMATION \n");
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
    barCodeData.forEach((item, index) => {
      const tag = (item?.TAGNO ?? "").toString().padEnd(10, " "); // SNO column
      const purity = (item?.PREFIX ?? "").padEnd(4, " ");
      const amount = ("Rate :" + (item?.RATE ?? 0).toFixed(2)).padStart(
        27,
        " "
      ); // right-align AMOUNT

      const mcg = `${item?.MAKINGCHARGES ?? 0}/g`.padEnd(6, " ");
      const mcAmt = `${Number(item?.CATTOTMC ?? 0).toFixed(2)}`.padStart(
        20,
        " "
      );
      const gwt = `${Number(item?.GWT ?? 0).toFixed(3)}`.padStart(27, " ");
      const swt = `${Number(item?.stonewt ?? 0).toFixed(3)}`.padStart(27, " ");
      const nwt = `${Number(item?.NWT ?? 0).toFixed(3)}`.padStart(27, " ");
      const WGrams = `${item?.WASTAGE ?? 0}%`.padEnd(6, " ");
      const WAmt = `${Number(item?.CATTOTWAST ?? 0).toFixed(2)}`.padStart(
        20,
        " "
      );
      const SAmt = `${Number(item?.ITEM_TOTAMT ?? 0).toFixed(2)}`.padStart(
        27,
        " "
      );
      const amt = `${Number(item?.SALE_AMOUNT ?? 0).toFixed(2)}`.padStart(
        27,
        " "
      );
      const amtNumber = Number(item?.SALE_AMOUNT ?? 0);
      const sAmtNumber = Number(item?.ITEM_TOTAMT ?? 0);
      const totalAmtValue = amtNumber + sAmtNumber;
      const totalAmt = `${Number(totalAmtValue ?? 0).toFixed(2)}`.padStart(
        27,
        " "
      );

      // Main row (aligned with header)
      printer.addTextFont(printer.FONT_B);
      printer.addTextAlign(printer.ALIGN_LEFT);
      printer.addTextSize(2, 1);
      printer.addText(tag);
      printer.addTextFont(printer.FONT_A);
      printer.addTextSize(1, 1);
      printer.addText(purity);
      printer.addText(amount);

      // Second row: Product Name + HSN + SMCODE + GST
      printer.addTextSize(1, 1);
      const name = (item.PRODUCTNAME || "").substring(0, 10).padEnd(10, " ");
      const piecesText = item.PIECES
        ? ` - ${item.PIECES} ${item.PIECES > 1 ? "Pieces" : "Piece"}`
        : "";
      printer.addText(`${name}${piecesText}\n`);
      printer.addText(`    GROSS WEIGHT   : ${gwt}\n`);
      printer.addText(`    STONE LESS     : ${swt}\n`);
      printer.addText(`    NWT WEIGHT     : ${nwt}\n`);
      printer.addText(`    WASTAGE        : ${WGrams} ${WAmt}\n`);
      printer.addText(`    TOTAL WEIGHT   : ${nwt}\n`);
      printer.addText(`    AMOUNT         : ${amt}\n`);
      printer.addText(`    MAKING CHARGES : ${mcg} ${mcAmt}\n`);
      printer.addText(`    STONE CHARGES  : ${SAmt}\n`);
      const matchedStones = stonesData.filter(
        (stone) => stone.TAGNO === item.TAGNO
      );
      matchedStones.forEach((stone, index) => {
        const itemName = (stone.ITEMNAME || "")
          .substring(0, 12)
          .padEnd(12, " ");
        const CTS = (
          stone?.CTS && stone.CTS !== 0 ? stone.CTS : stone?.GRMS ?? 0
        )
          .toFixed(3)
          .padEnd(5, " ");
        const rate = `${(stone?.RATE ?? 0).toFixed(2)}`.padEnd(7, " ");
        const amount = `${(stone?.AMOUNT ?? 0).toFixed(2)}`.padEnd(10, " ");
        printer.addTextFont(printer.FONT_C);
        printer.addTextSize(1, 1);
        printer.addText(
          `         ${itemName} :  ${CTS} CTS X   ${rate} = ${amount}\n`
        );
        printer.addTextFont(printer.FONT_A);
        printer.addTextSize(1, 1);
        printer.addFeedLine(1);
      });
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
    const leftLabel1 = "Tot Pcs  : ";
    const leftValue1 = String(totalPcs ?? 0);
    const leftText1 = leftLabel1 + leftValue1;

    const rightLabel1 = "Amount : ";
    const rightValue1 = totalAmt.toFixed(2);
    const rightText1 = rightLabel1 + rightValue1;

    let spaceCount1 = lineWidth - (leftText1.length + rightText1.length);
    let spaces1 = " ".repeat(spaceCount1 > 0 ? spaceCount1 : 1);

    printer.addText(leftText1 + spaces1 + rightText1 + "\n");

    // Gross Wt alone on left side
    printer.addText("Gross Wt : " + totalGwt.toFixed(3) + "\n");

    // Net Wt and GST in the same line
    const leftLabel2 = "Net Wt   : ";
    const leftValue2 = totalNwt.toFixed(3);
    const leftText2 = leftLabel2 + leftValue2;

    const rightLabel2 = `GST@6% : `;
    const rightValue2 = totalGstAmt.toFixed(2);
    const rightText2 = rightLabel2 + rightValue2;

    let spaceCount2 = lineWidth - (leftText2.length + rightText2.length);
    let spaces2 = " ".repeat(spaceCount2 > 0 ? spaceCount2 : 1);

    printer.addText(leftText2 + spaces2 + rightText2 + "\n");
    printer.addText("------------------------------------------------\n");
    printer.addTextFont(printer.FONT_B);
    printer.addTextAlign(printer.ALIGN_RIGHT);
    printer.addTextSize(2, 1);
    printer.addText(
      "TOTAL :" + " " + grandTotalAmount.toFixed(2) + "/-" + "\n"
    );
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
    printer.addText(`Date : ${dayjs().format("DD-MM-YYY hh:mm A")}\n`);
    printer.addText(`User Name : ${userName}\n`);
    printer.addFeedLine(2);
    printer.addCut(printer.CUT_FEED);

    // ---- SEND TO PRINTER ----
    printer.send();
    // };
  }
};
