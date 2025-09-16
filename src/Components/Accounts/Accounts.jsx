import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { DatePicker, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./Accounts.module.css";

const sections = [
  "Sales Register",
  "Product Wise Sales",
  "Brand Wise Sales",
  "Dealer Wise Sales",
  "Sales Man Wise Sales",
  "Date Wise Sales",
  "Purchase Type Wise Sales",
  "Tax Wise Sales",
  "HSN Wise Sales",
];

const { Option } = Select;

const Accounts = () => {
  const [expanded, setExpanded] = useState([]);
  const [open, setOpen] = useState(false);
  const [advanceFromDate, setAdvanceFromDate] = useState(dayjs());
  const [advanceToDate, setAdvanceToDate] = useState(dayjs());
  const [orderFromDate, setOrderFromDate] = useState(dayjs());
  const [orderToDate, setOrderToDate] = useState(dayjs());
  const [receiptFromDate, setReceiptFromDate] = useState(dayjs());
  const [receiptToDate, setReceiptToDate] = useState(dayjs());
  const [paymentFromDate, setPaymentFromDate] = useState(dayjs());
  const [paymentToDate, setPaymentToDate] = useState(dayjs());
  const [journalFromDate, setJournalFromDate] = useState(dayjs());
  const [journalToDate, setJournalToDate] = useState(dayjs());
  const [urdGoldFromDate, setUrdGoldFromDate] = useState(dayjs());
  const [urdGoldToDate, setUrdGoldToDate] = useState(dayjs());
  const [urdSilverFromDate, setUrdSilverFromDate] = useState(dayjs());
  const [urdSilverToDate, setUrdSilverToDate] = useState(dayjs());
  const [cashFromDate, setCashFromDate] = useState(dayjs());
  const [cashToDate, setCashToDate] = useState(dayjs());
  const [bookFromDate, setBookFromDate] = useState(dayjs());
  const [bookToDate, setBookToDate] = useState(dayjs());
  const [bankFromDate, setBankFromDate] = useState(dayjs());
  const [bankToDate, setBankToDate] = useState(dayjs());
  const [ornamentFromDate, setOrnamentFromDate] = useState(dayjs());
  const [ornamentToDate, setOrnamentToDate] = useState(dayjs());
  const [bullionFromDate, setBullionFromDate] = useState(dayjs());
  const [bullionToDate, setBullionToDate] = useState(dayjs());
  const [outstandingData, setOutstandingData] = useState([]);
  const [advanceData, setAdvanceData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [journalPaymentData, setJournalPaymentData] = useState([]);
  const [journalReceiptData, setJournalReceiptData] = useState([]);
  const [urdGoldData, setUrdGoldData] = useState([]);
  const [urdSilverData, setUrdSilverData] = useState([]);
  const [cashTransactionData, setCashTransactionData] = useState([]);
  const [openingAmount, setOpeningAmount] = useState(0);
  const [totalCreditAmount, setTotalCreditAmount] = useState(0);
  const [totalDebitAmount, setTotalDebitAmount] = useState(0);
  const [urdBookData, setUrdBookData] = useState([]);
  const [openingBookAmount, setOpeningBookAmount] = useState(0);
  const [totalCreditBookAmount, setTotalCreditBookAmount] = useState(0);
  const [totalDebitBookAmount, setTotalDebitBookAmount] = useState(0);
  const [selectProduct, setSelectProduct] = useState();
  const [bankData, setBankData] = useState([]);
  const [openingBankAmount, setOpeningBankAmount] = useState(0);
  const [totalCreditBankAmount, setTotalCreditBankAmount] = useState(0);
  const [totalDebitBankAmount, setTotalDebitBankAmount] = useState(0);
  const [bankAccountData, setBankAccountData] = useState([]);
  const [selectAccount, setSelectAccount] = useState();
  const [ornamentData, setOrnamentData] = useState([]);
  const [selectOrnamentData, setSelectOrnamentData] = useState([]);
  const [selectOrnament, setSelectOrnament] = useState();
  const [openingOrnamentAmount, setOpeningOrnamentAmount] = useState(0);
  const [totalCreditOrnamentAmount, setTotalCreditOrnamentAmount] = useState(0);
  const [totalDebitOrnamentAmount, setTotalDebitOrnamentAmount] = useState(0);
  const [bullionData, setBullionData] = useState([]);
  const [selectBullionData, setSelectBullionData] = useState([]);
  const [selectBullion, setSelectBullion] = useState();
  const [openingBullionAmount, setOpeningBullionAmount] = useState(0);
  const [totalCreditBullionAmount, setTotalCreditBullionAmount] = useState(0);
  const [totalDebitBullionAmount, setTotalDebitBullionAmount] = useState(0);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [totalAdvanceAmount, setTotalAdvanceAmount] = useState(0);
  const [totalReceiptAmount, setTotalReceiptAmount] = useState(0);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outstandingTotal, setOutstandingTotal] = useState(0);

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const outstandingCustomersAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/POSReports/GetOutStandingCustomers?cityName=%&custName=%&saleCode=1&mobileNo=%`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const filteredData = data.filter((item) => {
        const debit = Number(item.debit) || 0;
        const credit = Number(item.credit) || 0;
        return debit - credit !== 0;
      });

      setOutstandingData(filteredData);

      const todayBalance = filteredData.reduce((acc, item) => {
        const debit = Number(item.debit) || 0;
        const credit = Number(item.credit) || 0;
        return acc + debit - credit;
      }, 0);

      setOutstandingTotal(todayBalance);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const advanceAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=CUST_ADVANCES&where=RECDATE>='${dayjs(
          advanceFromDate
        ).format("MM/DD/YYYY")}' AND RECDATE<='${dayjs(advanceToDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.Recno, item])).values()
      );
      const todayBalance = uniqueData.reduce((acc, item) => {
        const amount = Number(item.TotWorth) || 0;
        return acc + amount;
      }, 0);
      setTotalAdvanceAmount(todayBalance);
      setAdvanceData(uniqueData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const orderAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=ORDER_MAST&where=ORDDATE>='${dayjs(
          orderFromDate
        ).format("MM/DD/YYYY")}' AND ORDDATE<='${dayjs(orderToDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.OrdNo, item])).values()
      );
      const todayBalance = uniqueData.reduce((acc, item) => {
        const amount = Number(item.ORDAMT) || 0;
        return acc + amount;
      }, 0);
      setTotalOrderAmount(todayBalance);
      setOrderData(uniqueData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const receiptAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=RECEIPTS&where=RECDATE>='${dayjs(
          receiptFromDate
        ).format("MM/DD/YYYY")}' AND RECDATE<='${dayjs(receiptToDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.Recno, item])).values()
      );
      const todayBalance = uniqueData.reduce((acc, item) => {
        const amount = Number(item.TotWorth) || 0;
        return acc + amount;
      }, 0);
      setTotalReceiptAmount(todayBalance);
      setReceiptData(uniqueData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const journalPaymentAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAY_TRANSACTIONS&where=SDATE>='${dayjs(
          paymentFromDate
        ).format("MM/DD/YYYY")}' AND SDATE<='${dayjs(paymentToDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const journalPayments = data.filter(
        (item) => item.MAINHEAD === "JOURNAL PAYMENT"
      );

      setJournalPaymentData(journalPayments);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const journalReceiptAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAY_TRANSACTIONS&where=SDATE>='${dayjs(
          journalFromDate
        ).format("MM/DD/YYYY")}' AND SDATE<='${dayjs(journalToDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const journalPayments = data.filter(
        (item) => item.MAINHEAD === "JOURNAL RECEIPT"
      );

      setJournalReceiptData(journalPayments);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDGoldAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=OLD_GPURCHASES_MAST&where=PDATE>='${dayjs(
          urdGoldFromDate
        ).format("MM/DD/YYYY")}' AND PDATE<='${dayjs(urdGoldToDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const urdGold = data.filter((item) => item.MNAME === "GOLD");

      setUrdGoldData(urdGold);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDSilverAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=OLD_GPURCHASES_MAST&where=PDATE>='${dayjs(
          urdSilverFromDate
        ).format("MM/DD/YYYY")}' AND PDATE<='${dayjs(urdSilverToDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const urdSilver = data.filter((item) => item.MNAME === "SILVER");

      setUrdSilverData(urdSilver);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const openingAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=CASH_BOOK&where=BillDATE<'${dayjs(
          cashFromDate
        ).format("MM/DD/YYYY")}' AND SALECODE=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.CREDIT) || 0;
        return acc + creditAmount;
      }, 0);

      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.DEBIT) || 0;
        return acc + debitAmount;
      }, 0);

      const totalOpenAmt = totalDebit - totalCredit;
      setOpeningAmount(totalOpenAmt || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const cashTransactionAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=CASH_BOOK&where=BillDATE>='${dayjs(
          cashFromDate
        ).format("MM/DD/YYYY")}' AND BillDATE<='${dayjs(cashToDate).format(
          "MM/DD/YYYY"
        )}' AND SALECODE=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.CREDIT) || 0;
        return acc + creditAmount;
      }, 0);
      setTotalDebitAmount(totalCredit || 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.DEBIT) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalCreditAmount(totalDebit || 0);
      setCashTransactionData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDBookOpeningAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='OLD' AND PARTICULARS='${selectProduct}' AND ENTRYDATE<'${dayjs(
          bookFromDate
        ).format("MM/DD/YYYY")}' AND DSTATUS=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);

      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);

      const totalOpenAmt = totalCredit - totalDebit;
      setOpeningBookAmount(totalOpenAmt || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDBookMainAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='OLD' AND PARTICULARS='${selectProduct}' AND ENTRYDATE>='${dayjs(
          bookFromDate
        ).format("MM/DD/YYYY")}' AND ENTRYDATE<='${dayjs(bookToDate).format(
          "MM/DD/YYYY"
        )}' AND DSTATUS=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);
      setTotalCreditBookAmount(totalCredit || 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalDebitBookAmount(totalDebit || 0);
      setUrdBookData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const bankOpeningAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=BANK_DEP_DRAW&where=DEPDATE<'${dayjs(
          bankFromDate
        ).format("MM/DD/YYYY")}' AND ACCNO='${selectAccount}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.Credit) || 0;
        return acc + creditAmount;
      }, 0);

      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.Debit) || 0;
        return acc + debitAmount;
      }, 0);

      const totalOpenAmt = totalCredit - totalDebit;
      setOpeningBankAmount(totalOpenAmt || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const bankAccountAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=BANKMASTER`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      setBankAccountData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const bankMainAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=BANK_DEP_DRAW&where=DEPDATE>='${dayjs(
          bankFromDate
        ).format("MM/DD/YYYY")}' AND DEPDATE>='${dayjs(bankFromDate).format(
          "MM/DD/YYYY"
        )}' AND ACCNO='${selectAccount}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.Credit) || 0;
        return acc + creditAmount;
      }, 0);
      setTotalCreditBankAmount(totalCredit || 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.Debit) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalDebitBankAmount(totalDebit || 0);
      setBankData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const ornamentSelectAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='GS12' AND ENTRYDATE<'${dayjs(
          ornamentFromDate
        ).format("MM/DD/YYYY")}' AND SALECODE=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const uniqueData = Array.from(
        new Map(data.map((item) => [item.PARTICULARS, item])).values()
      );
      setSelectOrnamentData(uniqueData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };
  const ornamentOpeningAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='GS12' AND ENTRYDATE<'${dayjs(
          ornamentFromDate
        ).format(
          "MM/DD/YYYY"
        )}' AND PARTICULARS='${selectOrnament}' AND SALECODE=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);

      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);

      const totalOpenAmt = totalCredit - totalDebit;
      setOpeningOrnamentAmount(totalOpenAmt || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const ornamentMainAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='GS12' AND ENTRYDATE>='${dayjs(
          ornamentFromDate
        ).format("MM/DD/YYYY")}' AND ENTRYDATE<='${dayjs(ornamentToDate).format(
          "MM/DD/YYYY"
        )}' AND PARTICULARS='${selectOrnament}' AND SALECODE=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);
      setTotalCreditOrnamentAmount(totalCredit || 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalDebitOrnamentAmount(totalDebit || 0);
      setOrnamentData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const bullionSelectAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='GS11' AND ENTRYDATE<'${dayjs(
          bullionFromDate
        ).format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const uniqueData = Array.from(
        new Map(data.map((item) => [item.PARTICULARS, item])).values()
      );
      setSelectBullionData(uniqueData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const bullionOpeningAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='GS11' AND ENTRYDATE<'${dayjs(
          bullionFromDate
        ).format("MM/DD/YYYY")}' AND PARTICULARS='${selectBullion}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);

      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);

      const totalOpenAmt = totalCredit - totalDebit;
      setOpeningBullionAmount(totalOpenAmt || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const bullionMainAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='GS11' AND ENTRYDATE>='${dayjs(
          bullionFromDate
        ).format("MM/DD/YYYY")}' AND ENTRYDATE<='${dayjs(bullionToDate).format(
          "MM/DD/YYYY"
        )}' AND PARTICULARS='${selectBullion}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);
      setTotalCreditBullionAmount(totalCredit || 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalDebitBullionAmount(totalDebit || 0);
      setBullionData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  // const userAPI = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=FIRM_CONFIGURE`,
  //       {
  //         headers: {
  //           tenantName: tenantName,
  //         },
  //       }
  //     );

  //     const data = response.data;

  //     if (Array.isArray(data) && data.length > 0) {
  //       const imageUrls = data[0]?.EPASS1.split(",");
  //       setImagesData(imageUrls);
  //       setUserName(data[0]?.FIRMNAME);
  //       setUserArea(data[0]?.CITY);
  //       setSingleImage(data[0]?.EPASS2);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching estimation count:", error);
  //   }
  // };

  useEffect(() => {
    outstandingCustomersAPI();
  }, []);

  useEffect(() => {
    orderAPI();
  }, [orderFromDate, orderToDate]);

  useEffect(() => {
    receiptAPI();
  }, [receiptFromDate, receiptToDate]);

  useEffect(() => {
    advanceAPI();
  }, [advanceFromDate, advanceToDate]);

  useEffect(() => {
    journalPaymentAPI();
  }, [paymentFromDate, paymentToDate]);

  useEffect(() => {
    journalReceiptAPI();
  }, [journalFromDate, journalToDate]);

  useEffect(() => {
    URDGoldAPI();
  }, [urdGoldFromDate, urdGoldToDate]);

  useEffect(() => {
    URDSilverAPI();
  }, [urdSilverFromDate, urdSilverToDate]);

  useEffect(() => {
    openingAPI();
    cashTransactionAPI();
  }, [cashFromDate, cashToDate]);

  useEffect(() => {
    URDBookOpeningAPI();
    URDBookMainAPI();
  }, [selectProduct, bookFromDate, bookToDate]);

  useEffect(() => {
    bankAccountAPI();
  }, []);

  useEffect(() => {
    bankMainAPI();
    bankOpeningAPI();
  }, [selectAccount, bankFromDate, bankToDate]);

  useEffect(() => {
    ornamentOpeningAPI();
    ornamentMainAPI();
    ornamentSelectAPI();
  }, [ornamentFromDate, ornamentToDate, selectOrnament]);

  useEffect(() => {
    // userAPI();
    bullionOpeningAPI();
    bullionMainAPI();
    bullionSelectAPI();
  }, [bullionFromDate, bullionToDate, selectBullion]);

  const handleExpandAll = () => {
    setExpanded("all");
    outstandingCustomersAPI();
    orderAPI();
    receiptAPI();
    advanceAPI();
    journalPaymentAPI();
    journalReceiptAPI();
    URDGoldAPI();
    URDSilverAPI();
    openingAPI();
    cashTransactionAPI();
    URDBookOpeningAPI();
    URDBookMainAPI();
    bankAccountAPI();
    bullionOpeningAPI();
    bullionMainAPI();
    ornamentOpeningAPI();
    ornamentMainAPI();
    bankMainAPI();
    bankOpeningAPI();
    ornamentSelectAPI();
    bullionSelectAPI();
  };

  const handleCollapseAll = () => {
    setExpanded(null);
  };

  const handleChange = (panel) => {
    setExpanded((prev) => (prev === panel ? null : panel));
  };

  const mainProduct = [
    {
      name: "OLD GOLD",
    },
    {
      name: "OLD SILVER",
    },
  ];

  useEffect(() => {
    if (!selectProduct && mainProduct.length > 0) {
      setSelectProduct(mainProduct[0].name);
    }
  }, [mainProduct, selectProduct]);

  useEffect(() => {
    if (!selectAccount && bankAccountData.length > 0) {
      setSelectAccount(bankAccountData[0].accno);
    }
  }, [bankAccountData, selectAccount]);

  useEffect(() => {
    if (!selectOrnament && selectOrnamentData.length > 0) {
      setSelectOrnament(selectOrnamentData[0].PARTICULARS);
    }
  }, [selectOrnamentData, selectOrnament]);

  useEffect(() => {
    if (!selectBullion && selectBullionData.length > 0) {
      setSelectBullion(selectBullionData[0].PARTICULARS);
    }
  }, [selectBullionData, selectBullion]);

  useEffect(() => {
    if (imagesData.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imagesData.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [imagesData]);

  return (
    <div>
      <Header setOpen={setOpen} />
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
      <div className={styles.carouselContainer}>
        <div
          className={styles.carouselSlider}
          style={{
            transform: `translateX(-${currentIndex * 33.33}%)`,
            width: `${imagesData.length * 100}%`,
          }}
        >
          {imagesData.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`img-${index}`}
              className={styles.carouselImage}
            />
          ))}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h3 className={styles.heading}>Accounts</h3>
          <div className={styles.buttonRow}>
            <button
              variant="outlined"
              type="default"
              className={styles.expandButton}
              onClick={handleExpandAll}
            >
              Expand All +
            </button>
            <button
              variant="outlined"
              type="default"
              className={styles.collapseButton}
              onClick={handleCollapseAll}
            >
              Collapse All -
            </button>
          </div>
        </div>
        <div style={{ marginBottom: "5px", marginTop: "10px" }}>
          <Accordion
            expanded={expanded === "panel1" || expanded === "all"}
            onChange={() => {
              handleChange("panel1");
              cashTransactionAPI();
              openingAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel1" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel1" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Cash Transactions
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel1" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel1" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={cashFromDate}
                  onChange={setCashFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={cashToDate}
                  onChange={setCashToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              <div
                style={{
                  background: "#333d63",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333d63",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Opening</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {openingAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Credit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#52bd91",
                    }}
                  >
                    {totalCreditAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Debit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "rgb(244, 25, 25)",
                    }}
                  >
                    {totalDebitAmount.toFixed(2) || 0}
                  </div>
                </div>

                {/* Closing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Closing</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {(
                      openingAmount +
                      totalCreditAmount -
                      totalDebitAmount
                    ).toFixed(2) || 0}
                  </div>
                </div>
              </div>
              {cashTransactionData.map((cash, index) => (
                <div
                  key={cash.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {cash.BILLNO || 0}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(cash.BILLDATE).format("DD-MM-YYYY") || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {cash.PARTICULARS || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Trans Type:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {cash.TYPE || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    {/* Credit Box or Placeholder */}
                    <div
                      style={{
                        flex: 1,
                        visibility: cash.DEBIT > 0 ? "visible" : "hidden", // Keeps layout gap
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Credit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#2e7d32",
                        }}
                      >
                        ₹ {cash.DEBIT.toFixed(2)}
                      </div>
                    </div>

                    {/* Debit Box or Placeholder */}
                    <div
                      style={{
                        flex: 1,
                        visibility: cash.CREDIT > 0 ? "visible" : "hidden", // Keeps layout gap
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Debit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#c62828",
                        }}
                      >
                        ₹ {cash.CREDIT.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel11" || expanded === "all"}
            onChange={() => {
              handleChange("panel11");
              bankMainAPI();
              bankAccountAPI();
              bankOpeningAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel11" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel11" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Bank Transactions
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel11" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel11" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={bankFromDate}
                  onChange={setBankFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={bookToDate}
                  onChange={setBankToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Account :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectAccount}
                  onChange={(value) => {
                    setSelectAccount(value);
                  }}
                >
                  {bankAccountData.map((metal, index) => (
                    <Option key={index} value={metal.accno}>
                      {metal.accno}
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  background: "#333d63",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333d63",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Opening</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {openingBankAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Credit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#52bd91",
                    }}
                  >
                    {totalCreditBankAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Debit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "rgb(244, 25, 25)",
                    }}
                  >
                    {totalDebitBankAmount.toFixed(2) || 0}
                  </div>
                </div>

                {/* Closing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Closing</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {(
                      openingBankAmount +
                      totalCreditBankAmount -
                      totalDebitBankAmount
                    ).toFixed(2) || 0}
                  </div>
                </div>
              </div>
              {bankData.map((bank, index) => (
                <div
                  key={bank.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {bank.RecNo || 0}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(bank.DEPDATE).format("DD-MM-YYYY") || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Party Name:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {bank.CustName || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Trans Type:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {bank.TRANSTYPE + " " + "/" + " " + bank.mode || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        visibility: bank.Credit > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Credit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#2e7d32",
                        }}
                      >
                        ₹ {bank.Credit.toFixed(2)}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        visibility: bank.Debit > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Debit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#c62828",
                        }}
                      >
                        ₹ {bank.Debit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel2" || expanded === "all"}
            onChange={() => {
              handleChange("panel2");
              outstandingCustomersAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel2" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel2" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Outstanding Customers
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  fontSize: "12px",
                  // marginLeft: "50px",
                  // background: "#fff",
                  backgroundColor:
                    expanded === "panel2" || expanded === "all"
                      ? "white"
                      : "#52bd91",
                  color:
                    expanded === "panel2" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "8px 10px 5px 10px",
                  borderRadius: "8px",
                }}
              >
                {/* Pending Dues:{" "} */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color:
                      expanded === "panel2" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel2" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {"₹" + outstandingTotal?.toFixed(2)}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel2" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel2" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {outstandingData.map((outstanding, index) => (
                <div
                  key={outstanding.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      {/* Bill No:{" "} */}
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {outstanding.CustName}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {outstanding.CityName}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {outstanding.MobileNum}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Balance:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {(outstanding.debit - outstanding.credit).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel3" || expanded === "all"}
            onChange={() => {
              handleChange("panel3");
              orderAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel3" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel3" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Customer Orders
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "30px",
                  fontSize: "12px",
                  backgroundColor:
                    expanded === "panel3" || expanded === "all"
                      ? "white"
                      : "#52bd91",
                  color:
                    expanded === "panel3" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "8px 10px 5px 10px",
                  borderRadius: "8px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color:
                      expanded === "panel3" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel3" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {"₹" + totalOrderAmount?.toFixed(2)}
                </span>
              </div> */}
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel3" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel3" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={orderFromDate}
                  onChange={setOrderFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={orderToDate}
                  onChange={setOrderToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              {orderData.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      Order No:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {order.OrdNo}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(order.OrdDate).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {order.CustName}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {order.CITYNAME}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {order.MobileNo}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {order.ORDAMT.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel4" || expanded === "all"}
            onChange={() => {
              handleChange("panel4");
              advanceAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel4" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel4" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Customer Advances
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "30px",
                  fontSize: "12px",
                  // marginLeft: "50px",
                  // background: "#fff",
                  backgroundColor:
                    expanded === "panel4" || expanded === "all"
                      ? "white"
                      : "#52bd91",
                  color:
                    expanded === "panel4" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "8px 10px 5px 10px",
                  borderRadius: "8px",
                }}
              >
                {/* Pending Dues:{" "} */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color:
                      expanded === "panel4" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel4" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {"₹" + totalAdvanceAmount?.toFixed(2)}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel4" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel4" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={advanceFromDate}
                  onChange={setAdvanceFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={advanceToDate}
                  onChange={setAdvanceToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              {advanceData.map((advance, index) => (
                <div
                  key={advance.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      Receipt No:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {advance.Recno}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(advance.RecDate).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {advance.CustName}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {advance.CITYNAME}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {advance.MOBILENUM}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {advance.TotWorth.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel5" || expanded === "all"}
            onChange={() => {
              handleChange("panel5");
              receiptAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel5" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel5" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Customer Receipts
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "30px",
                  fontSize: "12px",
                  // marginLeft: "50px",
                  // background: "#fff",
                  backgroundColor:
                    expanded === "panel5" || expanded === "all"
                      ? "white"
                      : "#52bd91",
                  color:
                    expanded === "panel5" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "8px 10px 5px 10px",
                  borderRadius: "8px",
                }}
              >
                {/* Pending Dues:{" "} */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color:
                      expanded === "panel5" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel5" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {"₹" + totalReceiptAmount?.toFixed(2)}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel5" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel5" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={receiptFromDate}
                  onChange={setReceiptFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={receiptToDate}
                  onChange={setReceiptToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              {receiptData.map((receipt, index) => (
                <div
                  key={receipt.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      Receipt No:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {receipt.Recno}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(receipt.RecDate).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {receipt.CustName}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {receipt.CITYNAME}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {receipt.MOBILENUM}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {receipt.TotWorth.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel12" || expanded === "all"}
            onChange={() => {
              handleChange("panel12");
              ornamentMainAPI();
              ornamentOpeningAPI();
              ornamentSelectAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel12" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel12" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              New Ornament Stock - GS12
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel12" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel12" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={ornamentFromDate}
                  onChange={setOrnamentFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={ornamentToDate}
                  onChange={setOrnamentToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectOrnament}
                  onChange={(value) => {
                    setSelectOrnament(value);
                  }}
                >
                  {selectOrnamentData.map((metal, index) => (
                    <Option key={index} value={metal.PARTICULARS}>
                      {metal.PARTICULARS}
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  background: "#333d63",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333d63",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Opening</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {openingOrnamentAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Credit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#52bd91",
                    }}
                  >
                    {totalCreditOrnamentAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Debit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "rgb(244, 25, 25)",
                    }}
                  >
                    {totalDebitOrnamentAmount.toFixed(2) || 0}
                  </div>
                </div>

                {/* Closing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Closing</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {(
                      openingOrnamentAmount +
                      totalCreditOrnamentAmount -
                      totalDebitOrnamentAmount
                    ).toFixed(2) || 0}
                  </div>
                </div>
              </div>
              {ornamentData.map((ornament, index) => (
                <div
                  key={ornament.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {ornament.VNO || 0}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(ornament.ENTRYDATE).format("DD-MM-YYYY") || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Type:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {ornament.STYPE || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {ornament.PARTYNAME || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        visibility: ornament.JAMA > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Credit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#2e7d32",
                        }}
                      >
                        ₹ {ornament.JAMA.toFixed(2)}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        visibility: ornament.NAMA > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Debit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#c62828",
                        }}
                      >
                        ₹ {ornament.NAMA.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel13" || expanded === "all"}
            onChange={() => {
              handleChange("panel13");
              bullionMainAPI();
              bullionOpeningAPI();
              bullionSelectAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel13" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel13" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Bullion Stock - GS11
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel13" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel13" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={bullionFromDate}
                  onChange={setBullionFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={bullionToDate}
                  onChange={setBullionToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectBullion}
                  onChange={(value) => {
                    setSelectBullion(value);
                  }}
                >
                  {selectBullionData.map((metal, index) => (
                    <Option key={index} value={metal.PARTICULARS}>
                      {metal.PARTICULARS}
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  background: "#333d63",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333d63",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Opening</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {openingBullionAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Credit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#52bd91",
                    }}
                  >
                    {totalCreditBullionAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Debit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "rgb(244, 25, 25)",
                    }}
                  >
                    {totalDebitBullionAmount.toFixed(2) || 0}
                  </div>
                </div>

                {/* Closing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Closing</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {(
                      openingBullionAmount +
                      totalCreditBullionAmount -
                      totalDebitBullionAmount
                    ).toFixed(2) || 0}
                  </div>
                </div>
              </div>
              {bullionData.map((bullion, index) => (
                <div
                  key={bullion.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {bullion.VNO || 0}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(bullion.ENTRYDATE).format("DD-MM-YYYY") || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Type:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {bullion.STYPE || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {bullion.PARTYNAME || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        visibility: bullion.JAMA > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Credit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#2e7d32",
                        }}
                      >
                        ₹ {bullion.JAMA.toFixed(2)}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        visibility: bullion.NAMA > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Debit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#c62828",
                        }}
                      >
                        ₹ {bullion.NAMA.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel6" || expanded === "all"}
            onChange={() => {
              handleChange("panel6");
              URDGoldAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel6" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel6" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              URD Gold
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel6" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel6" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={urdGoldFromDate}
                  onChange={setUrdGoldFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={urdGoldToDate}
                  onChange={setUrdGoldToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              {urdGoldData.map((gold, index) => (
                <div
                  key={gold.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {gold.PNO}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(gold.PDATE).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {gold.DEALERNAME}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Phone:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {gold.MOBILENUM}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {gold.TotGwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {gold.TotNwt.toFixed(3)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      FGold:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {gold.TotFGold.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {gold.TotAmount.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel7" || expanded === "all"}
            onChange={() => {
              handleChange("panel7");
              URDSilverAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel7" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel7" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              URD Silver
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel7" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel7" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={urdSilverFromDate}
                  onChange={setUrdSilverFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={urdSilverToDate}
                  onChange={setUrdSilverToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              {urdSilverData.map((silver, index) => (
                <div
                  key={silver.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {silver.PNO}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(silver.PDATE).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {silver.DEALERNAME}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Phone:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {silver.MOBILENUM}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {silver.TotGwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {silver.TotNwt.toFixed(3)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Fsilver:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {silver.TotFGold.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {silver.TotAmount.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel10" || expanded === "all"}
            onChange={() => {
              handleChange("panel10");
              URDBookMainAPI();
              URDBookOpeningAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel10" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel10" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              URD Gold / Silver Book
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel10" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel10" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={bookFromDate}
                  onChange={setBookFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={bookToDate}
                  onChange={setBookToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectProduct}
                  onChange={(value) => {
                    setSelectProduct(value);
                  }}
                >
                  {mainProduct.map((metal, index) => (
                    <Option key={index} value={metal.name}>
                      {metal.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  background: "#333d63",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333d63",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Opening</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {openingBookAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Received</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#52bd91",
                    }}
                  >
                    {totalCreditBookAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Issued</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "rgb(244, 25, 25)",
                    }}
                  >
                    {totalDebitBookAmount.toFixed(2) || 0}
                  </div>
                </div>

                {/* Closing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Closing</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {(
                      openingBookAmount +
                      totalCreditBookAmount -
                      totalDebitBookAmount
                    ).toFixed(2) || 0}
                  </div>
                </div>
              </div>
              {urdBookData.map((book, index) => (
                <div
                  key={book.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {book.VNO || 0}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(book.ENTRYDATE).format("DD-MM-YYYY") || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Type:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {book.STYPE || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {book.PARTYNAME || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        visibility: book.JAMA > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Credit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#2e7d32",
                        }}
                      >
                        ₹ {book.JAMA.toFixed(2)}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        visibility: book.NAMA > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        Debit
                      </span>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#c62828",
                        }}
                      >
                        ₹ {book.NAMA.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel8" || expanded === "all"}
            onChange={() => {
              handleChange("panel8");
              journalPaymentAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel8" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel8" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Journal Payment
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel8" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel8" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={paymentFromDate}
                  onChange={setPaymentFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={paymentToDate}
                  onChange={setPaymentToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              {journalPaymentData.map((payment, index) => (
                <div
                  key={payment.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {payment.VNO}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(payment.SDATE).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {payment.GROUPNAME}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {payment.PARTICULARS}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {payment.DEBIT_PAYMENT.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel9" || expanded === "all"}
            onChange={() => {
              handleChange("panel9");
              journalReceiptAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel9" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel9" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Journal Receipt
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel9" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel9" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div className={styles.dateFilters}>
                <DatePicker
                  value={journalFromDate}
                  onChange={setJournalFromDate}
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
                <DatePicker
                  value={journalToDate}
                  onChange={setJournalToDate}
                  className={styles.datePicker1}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              {journalReceiptData.map((receipt, index) => (
                <div
                  key={receipt.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {receipt.VNO}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dayjs(receipt.SDATE).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {receipt.GROUPNAME}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {receipt.PARTICULARS}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {receipt.CREDIT_RECEIPT.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
