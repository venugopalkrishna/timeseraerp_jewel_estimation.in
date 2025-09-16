import { DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./Graphs.module.css";
import CustomTooltip from "../Dashboard/CustomToolTip";

const Graphs = () => {
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [totalSalesGraph, setTotalSalesGraph] = useState([]);
  const [salesGraph, setSalesGraph] = useState([]);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const colorMap = {
    Monday: [
      " #d9dba4",
      "violet",
      " #75b7b3",
      " #162566",
      " #52bd91",
      " #cc92c1",
      " #f4a261",
    ],
    Tuesday: [
      " #f94144",
      " #f3722c",
      " #f8961e",
      " #f9844a",
      " #f9c74f",
      " #90be6d",
      " #43aa8b",
    ],
    Wednesday: [
      " #577590",
      " #277da1",
      " #4d908e",
      " #43aa8b",
      " #90be6d",
      " #f9c74f",
      " #f9844a",
    ],
    Thursday: [
      " #a29bfe",
      " #81ecec",
      " #fab1a0",
      " #fd79a8",
      " #e17055",
      " #00b894",
      " #6c5ce7",
    ],
    Friday: [
      " #00cec9",
      " #0984e3",
      " #6c5ce7",
      " #fd79a8",
      " #e84393",
      " #2d3436",
      " #ffeaa7",
    ],
    Saturday: [
      " #ff7675",
      " #74b9ff",
      " #a29bfe",
      " #00b894",
      " #ffeaa7",
      " #fab1a0",
      " #fdcb6e",
    ],
    Sunday: [
      " #636e72",
      " #2d3436",
      " #dfe6e9",
      " #b2bec3",
      " #ffeaa7",
      " #fdcb6e",
      " #e17055",
    ],
  };
  const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const color = colorMap[dayOfWeek] || colorMap.Monday;
  const colors = ["#FFBB28", "#FF8042", "#0088FE", "black"];
  const barColors = colorMap[dayOfWeek] || colorMap.Monday;

  const toggleDrawer = () => {
    setOpen(false);
  };

  const TotalSalesGraphAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetTotalSaleValue?fromBillDate=${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}&toBillDate=${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}&saleCode=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const transformedData = data.map((item) => ({
        date: item.JewelType,
        amt: item.NetAmt,
        TotGwt: item.TotGwt,
        TotNwt: item.TotNwt,
        TotPieces: item.TotPieces,
      }));
      setTotalSalesGraph(transformedData);
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

  const fetchTotalSaleAmt = async (date) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=BILL_MAST&where=BILLDATE>='${dayjs(
          date
        ).format("MM/DD/YYYY")}' AND BILLDATE<='${dayjs(date).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      return Array.isArray(data) && data.length > 0
        ? data.reduce((acc, item) => {
            const balance = Number(item.NetAmt) || 0;
            return acc + balance;
          }, 0)
        : 0;
    } catch (error) {
      console.error("Error fetching sale amount for", date, ":", error);
      return 0;
    }
  };

  useEffect(() => {
    const loadSalesData = async () => {
      const dates = [0, 1, 2, 3].map((d) => dayjs(fromDate).subtract(d, "day"));
      const results = await Promise.all(
        dates.map((date) =>
          fetchTotalSaleAmt(date).then((amt) => ({
            date: dayjs(date).format("DD-MMM"),
            amt: amt,
          }))
        )
      );
      
      // Reverse so oldest comes first (if needed)
      setSalesGraph(results.reverse());
    };

    loadSalesData();
  }, [fromDate]);

  useEffect(() => {
    TotalSalesGraphAPI();
    // userAPI();
  }, [fromDate, toDate]);

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

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
          <h3 className={styles.heading}>Graphs</h3>
        </div>

        {/* Date Filters */}
        <div className={styles.dateFilters}>
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            className={styles.datePicker}
            inputReadOnly
            format="DD-MMM-YYYY"
          />
          <DatePicker
            value={toDate}
            onChange={setToDate}
            className={styles.datePicker1}
            inputReadOnly
            format="DD-MMM-YYYY"
          />
        </div>
        <div className={styles.totalSalesTitle}>Total Sales</div>
        <div className={styles.barChartContainer}>
          <BarChart
            width={500}
            height={300}
            data={
              totalSalesGraph.length ? totalSalesGraph : [{ date: "", amt: 0 }]
            }
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 14, fontWeight: "bold", fill: "#555" }}
            />
            <YAxis domain={[0, 1000]} />
            {totalSalesGraph.length && <Tooltip content={<CustomTooltip />} />}
            <Bar
              dataKey="amt"
              fill="#8884d8"
              label={{ position: "top" }}
              barSize={60}
            >
              {(totalSalesGraph.length ? totalSalesGraph : [{ amt: 0 }]).map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={color[index % color.length]}
                  />
                )
              )}
            </Bar>
          </BarChart>
        </div>
        <div className={styles.totalSalesTitle}>
          Sales Over the Last{" "}
          <sapn style={{ fontWeight: "bold", color: "red" }}>4</sapn> Days
        </div>
        <div className={styles.barChartContainer}>
          <BarChart
            width={500}
            height={300}
            data={salesGraph?.length ? salesGraph : [{ date: "", amt: 0 }]}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 14, fontWeight: "bold", fill: "#555" }}
            />
            <YAxis domain={[0, 1000]} />
            <Bar
              dataKey="amt"
              fill="#8884d8"
              shape={<TriangleBar />}
              label={{ position: "top" }}
              barSize={60}
            >
              {(salesGraph.length ? salesGraph : [{ amt: 0 }]).map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                )
              )}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
