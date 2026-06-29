import {
  CheckOutlined,
  LoadingOutlined,
  ReloadOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import SidebarDrawer from "../SidebarDrawer";
import Header from "../Header";
import { CREATE_jwel } from "../Config/Config";

const PRODUCT_ORDER = ["DIAMONDS", "GOLD", "SILVER"];

const sortProducts = (products) => {
  const up = (p) => p.toUpperCase();
  const pinned = PRODUCT_ORDER.filter((o) => products.map(up).includes(o)).map(
    (o) => products.find((p) => up(p) === o),
  );
  const rest = products.filter((p) => !PRODUCT_ORDER.includes(up(p))).sort();
  return [...pinned, ...rest].filter(Boolean);
};

const groupByProduct = (data) => {
  const map = {};
  data.forEach((item) => {
    const key = item.MAINPRODUCT;
    if (!map[key]) map[key] = [];
    const idx = map[key].findIndex((r) => r.PREFIX === item.PREFIX);
    if (idx === -1) map[key].push({ ...item });
    else map[key][idx] = { ...item };
  });
  return map;
};

const ACCENT = {
  DIAMONDS: {
    bg: "linear-gradient(135deg,#e0f2fe,#dbeafe)",
    txt: "#1e40af",
    border: "#93c5fd",
    badge: "#1d4ed8",
    badgeBg: "#dbeafe",
    icon: "💎",
    glow: "rgba(59,130,246,0.18)",
  },
  GOLD: {
    bg: "linear-gradient(135deg,#fef9c3,#fef3c7)",
    txt: "#92400e",
    border: "#fcd34d",
    badge: "#b45309",
    badgeBg: "#fef3c7",
    icon: "🪙",
    glow: "rgba(245,158,11,0.18)",
  },
  SILVER: {
    bg: "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
    txt: "#334155",
    border: "#cbd5e1",
    badge: "#475569",
    badgeBg: "#e2e8f0",
    icon: "🥈",
    glow: "rgba(100,116,139,0.14)",
  },
  PLATINUM: {
    bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
    txt: "#5b21b6",
    border: "#c4b5fd",
    badge: "#6d28d9",
    badgeBg: "#ede9fe",
    icon: "⚪",
    glow: "rgba(139,92,246,0.16)",
  },
};

const DYNAMIC_PALETTE = [
  {
    bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    txt: "#065f46",
    border: "#6ee7b7",
    badge: "#059669",
    badgeBg: "#d1fae5",
    icon: "✨",
    glow: "rgba(16,185,129,0.16)",
  },
  {
    bg: "linear-gradient(135deg,#ecfeff,#cffafe)",
    txt: "#155e75",
    border: "#67e8f9",
    badge: "#0e7490",
    badgeBg: "#cffafe",
    icon: "🔷",
    glow: "rgba(8,145,178,0.16)",
  },
  {
    bg: "linear-gradient(135deg,#fdf4ff,#fae8ff)",
    txt: "#86198f",
    border: "#f0abfc",
    badge: "#a21caf",
    badgeBg: "#fae8ff",
    icon: "💠",
    glow: "rgba(168,85,247,0.16)",
  },
  {
    bg: "linear-gradient(135deg,#fff7ed,#ffedd5)",
    txt: "#9a3412",
    border: "#fdba74",
    badge: "#c2410c",
    badgeBg: "#ffedd5",
    icon: "🔶",
    glow: "rgba(234,88,12,0.16)",
  },
  {
    bg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
    txt: "#3730a3",
    border: "#a5b4fc",
    badge: "#4338ca",
    badgeBg: "#e0e7ff",
    icon: "🔹",
    glow: "rgba(67,56,202,0.16)",
  },
  {
    bg: "linear-gradient(135deg,#fff1f2,#ffe4e6)",
    txt: "#9f1239",
    border: "#fda4af",
    badge: "#be123c",
    badgeBg: "#ffe4e6",
    icon: "🌸",
    glow: "rgba(190,18,60,0.16)",
  },
  {
    bg: "linear-gradient(135deg,#fef2f2,#fee2e2)",
    txt: "#991b1b",
    border: "#fca5a5",
    badge: "#b91c1c",
    badgeBg: "#fee2e2",
    icon: "🔺",
    glow: "rgba(185,28,28,0.16)",
  },
];

const hashStr = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const accent = (p) => {
  const key = p?.toUpperCase() ?? "";
  if (ACCENT[key]) return ACCENT[key];
  return DYNAMIC_PALETTE[hashStr(key) % DYNAMIC_PALETTE.length];
};

/* ── bright, jewel-toned header background derived from each accent's
   own badge/border colors — so it reads as "rich", not "washed out",
   while still being unique per product ── */
const brightHeaderBg = (ac) =>
  `linear-gradient(100deg, ${ac.badge} 0%, ${ac.border} 55%, ${ac.badge} 100%)`;

/* a quiet, simple background motif made from the card's OWN icon —
   "related" to the block without needing a hand-drawn image per type */
const iconPattern = (icon) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
       <text x='2' y='26' font-size='20' opacity='0.20'>${icon}</text>
       <text x='34' y='58' font-size='20' opacity='0.20'>${icon}</text>
     </svg>`,
  )}")`;

const CARD_SHIMMER =
  "linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.38) 50%, transparent 65%)";
const TOP_SHIMMER =
  "linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.16) 50%, transparent 65%)";
const BTN_SHIMMER =
  "linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)";

const PrefixCell = ({
  row,
  ac,
  isFlashing,
  inputRefs,
  product,
  handleRateChange,
  handleKeyDown,
}) => {
  const key = `${product}__${row.PREFIX}`;
  return (
    <div
      className={isFlashing ? "dr-sync-flash dr-cell" : "dr-cell"}
      style={{
        minWidth: 0,
        borderRadius: 9,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: ac.txt,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
          }}
        >
          {row.PREFIX}
        </span>
        {/* {row.PUREORNOT && (
          <span
            style={{
              fontSize: 7.5,
              fontWeight: 700,
              color: ac.badge,
              background: ac.badgeBg,
              padding: "1px 4px",
              borderRadius: 6,
              flexShrink: 0,
              letterSpacing: "0.2px",
            }}
          >
            PURE
          </span>
        )} */}
      </div>

      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 7,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 10.5,
            fontWeight: 800,
            color: ac.badge,
            pointerEvents: "none",
          }}
        >
          ₹
        </span>
        <input
          ref={(el) => {
            inputRefs.current[key] = el;
          }}
          className="dr-rate-input"
          type="number"
          defaultValue={row.RATE}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            e.target.value = value;
            handleRateChange(product, row.PREFIX, e.target.value);
          }}
          onKeyDown={(e) => handleKeyDown(e, product, row.PREFIX)}
          onFocus={(e) => e.target.select()}
          style={{
            width: "100%",
            boxSizing: "border-box",
            height: 30,
            border: `1px solid ${ac.border}`,
            borderRadius: 7,
            padding: "0 8px 0 19px",
            fontSize: 12,
            fontWeight: 800,
            color: ac.txt,
            textAlign: "right",
            background: "#fff",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        />
      </div>
    </div>
  );
};

const DailyRates = () => {
  const tenantName = localStorage.getItem("tenantName");
  const [grouped, setGrouped] = useState({});
  const [sortedProducts, setSortedProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);
  const [syncFlash, setSyncFlash] = useState(new Set());
  const inputRefs = useRef({});
  const [open, setOpen] = useState(false);
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");

  const fetchRates = async () => {
    setLoading(true);
    try {
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const masterRes = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=Prefix_Master`,
        { headers: { tenantName } },
      );
      const displayableRows = (masterRes.data ?? []).filter(
        (item) => item.DISPLAY_DRATES === true,
      );
      const allowedKeys = new Set(
        displayableRows.map(
          (item) => `${item.MAINPRODUCT}__${item.Prefix ?? item.PREFIX}`,
        ),
      );
      const res = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE='${currentDate}'`,
        { headers: { tenantName } },
      );
      const today = new Date().toISOString().split("T")[0];
      let flat = (res.data ?? []).filter(
        (item) => item.RDATE?.split("T")[0] === today,
      );
      if (flat.length === 0) {
        flat = displayableRows.map((item) => ({
          ...item,
          MAINPRODUCT: item.MAINPRODUCT,
          PREFIX: item.Prefix ?? item.PREFIX,
          RATE: item.RATE ?? 0,
          TEMP_RATE: item.SCHEME_CALC ? 1 : 0,
        }));
      } else {
        flat = flat
          .filter((item) =>
            allowedKeys.has(`${item.MAINPRODUCT}__${item.PREFIX}`),
          )
          .map((item) => {
            const master = displayableRows.find(
              (m) =>
                m.MAINPRODUCT === item.MAINPRODUCT &&
                (m.Prefix ?? m.PREFIX) === item.PREFIX,
            );
            return {
              ...item,
              SCHEME_CALC: master?.SCHEME_CALC ?? false, // ← carry SCHEME_CALC from master
              TEMP_RATE: master?.SCHEME_CALC ? 1 : 0,
            };
          });
      }
      const grp = groupByProduct(flat);
      setGrouped(grp);
      setSortedProducts(sortProducts(Object.keys(grp)));
    } catch (err) {
      console.error("Error fetching rates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []); // eslint-disable-line

  const handleRateChange = (product, prefix, value) => {
    const newRate = parseFloat(value) || 0;
    setGrouped((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((prod) => {
        if (updated[prod].some((r) => r.PREFIX === prefix)) {
          updated[prod] = updated[prod].map((r) =>
            r.PREFIX === prefix ? { ...r, RATE: newRate } : r,
          );
        }
      });
      return updated;
    });
    setTimeout(() => {
      const sourceKey = `${product}__${prefix}`;
      const affected = [];
      Object.keys(inputRefs.current).forEach((key) => {
        const [, refPrefix] = key.split("__");
        if (refPrefix === prefix && key !== sourceKey) {
          const el = inputRefs.current[key];
          if (el) {
            el.value = newRate === 0 ? "0" : String(newRate);
            affected.push(key);
          }
        }
      });
      if (affected.length > 0) {
        setSyncFlash(new Set(affected));
        setTimeout(() => setSyncFlash(new Set()), 700);
      }
    }, 0);
  };
  const flatRows = sortedProducts.flatMap((p) =>
    (grouped[p] ?? []).map((r) => ({ product: p, prefix: r.PREFIX })),
  );

  const handleKeyDown = (e, product, prefix) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const idx = flatRows.findIndex(
      (r) => r.product === product && r.prefix === prefix,
    );
    if (idx < flatRows.length - 1) {
      const next = flatRows[idx + 1];
      inputRefs.current[`${next.product}__${next.prefix}`]?.focus();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const today = new Date().toLocaleDateString("en-CA");
    setSubmitting(true);
    try {
      // ── Step 1: Delete today's existing rates ──
      await axios.post(
        `${CREATE_jwel}/api/Erp/DailyRatesDelete?rDate=${today}`,
        {},
        { headers: { tenantName } },
      );

      // ── Step 2: Flatten grouped state for DailyRatesInsert + RATE update ──
      const allRates = Object.values(grouped).flat();

      // ── Step 3: Fetch fresh Prefix_Master to get PUREORNOT source of truth ──
      const prefixMasterRes = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=Prefix_Master`,
        { headers: { tenantName } },
      );
      const prefixMasterData = prefixMasterRes.data ?? [];

      // ── Step 4: Build pureRates from Prefix_Master
      //    - filter PUREORNOT === true
      //    - for each pure row, find its matching RATE from grouped/allRates
      //      (match by MAINPRODUCT + PREFIX)
      //    - dedupe by MAINPRODUCT — one FINERATE call per unique product
      const seenMainProducts = new Set();
      const pureRates = [];

      prefixMasterData.forEach((masterRow) => {
        if (masterRow.PUREORNOT !== true) return;

        const mainProduct = masterRow.MAINPRODUCT;
        const prefix = masterRow.Prefix ?? masterRow.PREFIX;

        if (seenMainProducts.has(mainProduct)) return;
        seenMainProducts.add(mainProduct);

        // Find the matching rate from daily rates state
        const matchedRate = allRates.find(
          (r) => r.MAINPRODUCT === mainProduct && r.PREFIX === prefix,
        );

        pureRates.push({
          MAINPRODUCT: mainProduct,
          PREFIX: prefix,
          // Use matched rate from grouped state; fallback to masterRow.RATE
          RATE: matchedRate?.RATE ?? masterRow.RATE ?? 0,
        });
      });

      // ── Step 5: Fire all loops in parallel ──
      await Promise.all([
        // Loop 1 — insert daily rates (all grouped rows)
        ...allRates.map((rate) =>
          axios.post(
            `${CREATE_jwel}/api/Erp/DailyRatesInsert`,
            {
              rdate: today,
              mainproduct: String(rate.MAINPRODUCT ?? ""),
              prefix: String(rate.PREFIX ?? ""),
              rate: Number(rate.RATE ?? 0),
              pureornot: Boolean(rate.PUREORNOT),
              temP_RATE: rate.SCHEME_CALC ? 1 : 0,
              cloud_upload: Boolean(rate.cloud_upload ?? true),
            },
            { headers: { tenantName } },
          ),
        ),

        // Loop 2 — update TAG_GENERATION RATE for all rows
        // (by MNAME + PREFIX)
        ...allRates.map((rate) =>
          axios.post(
            `${CREATE_jwel}/api/Master/CommonUpdateWithWhere`,
            {
              tableName: "TAG_GENERATION",
              updateString: `RATE=${Number(rate.RATE ?? 0)}`,
              whereString: `MNAME='${rate.MAINPRODUCT}' AND PREFIX='${rate.PREFIX}'`,
            },
            { headers: { tenantName } },
          ),
        ),

        // Loop 3 — update TAG_GENERATION FINERATE
        // Based on Prefix_Master PUREORNOT=true rows
        // One call per unique MAINPRODUCT, no PREFIX in where clause
        ...pureRates.map((rate) =>
          axios.post(
            `${CREATE_jwel}/api/Master/CommonUpdateWithWhere`,
            {
              tableName: "TAG_GENERATION",
              updateString: `FINERATE=${Number(rate.RATE ?? 0)}`,
              whereString: `MNAME='${rate.MAINPRODUCT}'`,
            },
            { headers: { tenantName } },
          ),
        ),
      ]);

      // ── Step 6: Show success flash ──
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);

      // ── Step 7: Re-fetch fresh data from server ──
      fetchRates();
    } catch (err) {
      console.error("Error submitting rates:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const dayStr = today.toLocaleDateString("en-IN", { weekday: "short" });
  /* ── SVG background ── */
  const svgBg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
ellipse cx="30" cy="20" rx="55" ry="45" fill="#F4C0D1" opacity="0.5"/>
  <ellipse cx="390" cy="40" rx="100" ry="90" fill="#eaf3de" opacity="0.85"/>
  <ellipse cx="370" cy="0" rx="60" ry="50" fill="#c0dd97" opacity="0.45"/>
  <circle cx="195" cy="30" r="40" fill="#faeeda" opacity="0.7"/>
  <ellipse cx="0" cy="360" rx="70" ry="120" fill="#ede9fe" opacity="0.7"/>
  <ellipse cx="390" cy="420" rx="80" ry="130" fill="#eaf3de" opacity="0.65"/>
  <circle cx="310" cy="160" r="28" fill="#fbeaf0" opacity="0.8"/>
  <circle cx="78" cy="290" r="22" fill="#faeeda" opacity="0.8"/>
  <ellipse cx="0" cy="800" rx="110" ry="90" fill="#faeeda" opacity="0.75"/>
  <ellipse cx="390" cy="810" rx="105" ry="95" fill="#fbeaf0" opacity="0.8"/>
  <ellipse cx="195" cy="844" rx="90" ry="60" fill="#eaf3de" opacity="0.6"/>
  <circle cx="140" cy="110" r="5" fill="#FAC775" opacity="0.5"/>
  <circle cx="260" cy="230" r="4" fill="#D4537E" opacity="0.4"/>
  <circle cx="55" cy="500" r="6" fill="#97c459" opacity="0.45"/>
  <circle cx="345" cy="320" r="5" fill="#4f46e5" opacity="0.3"/>
</svg>
`);

  const parentStyle = {
    backgroundColor: "#ffffff",
    backgroundImage: `url("data:image/svg+xml,${svgBg}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    padding: "8px 12px 0",
    minHeight: "calc(100vh - 68px)",
  };

  const topHeaderBg = `${TOP_SHIMMER}, linear-gradient(120deg,#0f172a 0%,#1e3a5f 35%,#2547a0 65%,#1a3a6e 100%)`;

  return (
    <>
      <Header setOpen={setOpen} />
      <div style={parentStyle}>
        <div
          className="dr-top-header dr-shimmer"
          style={{ backgroundImage: topHeaderBg }}
        >
          <div className="dr-top-left">
            <div className="dr-top-icon-box">
              <RiseOutlined
                style={{ color: "#fbbf24", fontSize: 14 }}
                className="dr-rise"
              />
            </div>
            <div className="dr-top-text">
              <div className="dr-top-title">Daily Rates</div>
              <div className="dr-top-sub">
                {dayStr}, {dateStr}
              </div>
            </div>
          </div>
          <div className="dr-top-actions">
            <button
              onClick={fetchRates}
              disabled={loading}
              className="dr-icon-btn"
              title="Refresh"
            >
              {loading ? (
                <LoadingOutlined style={{ fontSize: 13 }} />
              ) : (
                <ReloadOutlined style={{ fontSize: 13 }} />
              )}
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting || loading}
              className={`dr-save-btn dr-btn-primary ${savedFlash ? "dr-btn-pop" : ""}`}
              style={{
                backgroundImage: `${BTN_SHIMMER}, ${
                  savedFlash
                    ? "linear-gradient(135deg,#059669,#10b981)"
                    : "linear-gradient(135deg,#2563eb,#3b82f6)"
                }`,
                "--btn-glow-a": savedFlash
                  ? "rgba(16,185,129,0.45)"
                  : "rgba(37,99,235,0.45)",
                "--btn-glow-b": savedFlash
                  ? "rgba(16,185,129,0.75)"
                  : "rgba(37,99,235,0.75)",
                cursor: submitting ? "wait" : "pointer",
                opacity: submitting ? 0.75 : 1,
              }}
            >
              {submitting ? (
                <>
                  <LoadingOutlined style={{ fontSize: 12 }} /> Saving…
                </>
              ) : savedFlash ? (
                <>
                  <CheckOutlined style={{ fontSize: 12 }} /> Saved!
                </>
              ) : (
                <>
                  <CheckOutlined style={{ fontSize: 12 }} /> Save Rates
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "14px 0 14px 0",
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 260,
                gap: 12,
                color: "#94a3b8",
              }}
            >
              <LoadingOutlined style={{ fontSize: 30, color: "#3b82f6" }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Loading today's rates…
              </span>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 260,
                gap: 10,
              }}
            >
              <span style={{ fontSize: 36 }}>📊</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>
                No rate data found
              </span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>
                No prefixes are marked for display
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sortedProducts.map((product) => {
                const ac = accent(product);
                const prefixes = grouped[product] ?? [];

                return (
                  <div
                    key={product}
                    className="dr-product-card"
                    style={{
                      background: "#fff",
                      borderRadius: 13,
                      border: `1px solid ${ac.border}`,
                      overflow: "hidden",
                      boxShadow: `0 2px 10px ${ac.glow}, 0 1px 3px rgba(0,0,0,0.04)`,
                    }}
                  >
                    <div
                      className="dr-card-header dr-card-glow"
                      style={{
                        backgroundImage: `${iconPattern(ac.icon)}, ${CARD_SHIMMER}, ${brightHeaderBg(ac)}`,
                      }}
                    >
                      <span className="dr-card-icon-badge">{ac.icon}</span>
                      <span className="dr-card-title">{product}</span>
                    </div>
                    <div className="dr-rate-grid">
                      {prefixes.map((row) => (
                        <PrefixCell
                          key={`${product}__${row.PREFIX}`}
                          row={row}
                          ac={ac}
                          isFlashing={syncFlash.has(
                            `${product}__${row.PREFIX}`,
                          )}
                          inputRefs={inputRefs}
                          product={product}
                          handleRateChange={handleRateChange}
                          handleKeyDown={handleKeyDown}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <style>{`
        /* ── top header sheen (2 layers: sheen + base gradient) ── */
        .dr-shimmer {
          background-repeat: no-repeat;
          background-size: 220% 100%, 100% 100%;
          animation: drShimmerSweep 5.5s ease-in-out infinite;
        }
        @keyframes drShimmerSweep {
          0%   { background-position: -50% 0, 0 0; }
          50%  { background-position: 150% 0, 0 0; }
          100% { background-position: -50% 0, 0 0; }
        }

        /* ── card header (3 layers: icon scatter + sheen + base gradient) ── */
        .dr-card-glow {
          background-repeat: repeat, no-repeat, no-repeat;
          background-size: 64px 64px, 220% 100%, 100% 100%;
          animation: drCardSweep 5.5s ease-in-out infinite;
        }
        @keyframes drCardSweep {
          0%   { background-position: 0 0, -50% 0, 0 0; }
          50%  { background-position: 0 0, 150% 0, 0 0; }
          100% { background-position: 0 0, -50% 0, 0 0; }
        }

        /* ── top "Daily Rates" header — single row, always ── */
        .dr-top-header {
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: nowrap;
          box-shadow: 0 4px 20px rgba(15,23,42,0.22);
          flex-shrink: 0;
          border-radius: 10px;
        }
        .dr-top-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          overflow: hidden;
          flex: 1 1 auto;
        }
        .dr-top-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dr-top-text { min-width: 0; overflow: hidden; }
        .dr-top-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dr-top-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dr-top-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .dr-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.80);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .dr-icon-btn:hover { background: rgba(255,255,255,0.18); }
        .dr-save-btn {
          height: 32px;
          padding: 0 14px;
          font-size: 12.5px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (max-width: 360px) {
          .dr-top-header { padding: 12px 12px; gap: 8px; }
          .dr-top-icon-box { width: 34px; height: 34px; }
          .dr-top-title { font-size: 14px; }
          .dr-top-sub { font-size: 10px; }
          .dr-save-btn { padding: 0 10px; font-size: 11.5px; }
          .dr-icon-btn { width: 30px; height: 30px; }
        }

        /* ── product card header ── */
        .dr-card-header {
          padding: 7px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .dr-card-icon-badge {
          width: 25px;
          height: 25px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          line-height: 1;
          flex-shrink: 0;
          background: rgba(255,255,255,0.25);
          border: 1px solid rgba(255,255,255,0.4);
        }
        .dr-card-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.25);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        /* ── responsive rate grid — fits 3 per row on a normal phone;
           a lone rate stretches to fill the row instead of leaving a
           dead gap ── */
        .dr-rate-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 10px;
        }

        .dr-rate-input::-webkit-inner-spin-button,
        .dr-rate-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .dr-rate-input[type=number] { -moz-appearance: textfield; }
        .dr-rate-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.14) !important; background: #f0f9ff !important; }
        @keyframes drSyncFlash { 0%{background:#fef9c3!important} 50%{background:#fef08a!important} 100%{background:transparent} }
        .dr-sync-flash { animation: drSyncFlash 0.7s ease forwards !important; }
        @keyframes drRise { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-4px) rotate(-8deg)} 70%{transform:translateY(1px) rotate(4deg)} }
        .dr-rise { display:inline-block; animation:drRise 2.8s ease-in-out infinite; }
        .dr-product-card { transition: box-shadow 0.2s; }
        .dr-product-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09) !important; }
        .dr-cell:hover { background: rgba(0,0,0,0.025) !important; }

        /* ── shared action-button language: animated sweep + a gentle
           breathing glow at rest, a quick pop the moment it saves ── */
        .dr-btn-primary {
          position: relative;
          border: none;
          color: #fff;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          border-radius: 9px;
          background-repeat: no-repeat;
          background-size: 220% 100%, 100% 100%;
          animation: drBtnSweep 4s ease-in-out infinite, drBtnGlow 2.6s ease-in-out infinite;
          transition: transform 0.15s, filter 0.15s;
        }
        .dr-btn-primary:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.08); }
        .dr-btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.97); }
        .dr-btn-primary.dr-btn-pop { animation: drBtnPop 0.45s ease; }
        @keyframes drBtnSweep {
          0%   { background-position: -60% 0, 0 0; }
          50%  { background-position: 160% 0, 0 0; }
          100% { background-position: -60% 0, 0 0; }
        }
        @keyframes drBtnGlow {
          0%, 100% { box-shadow: 0 2px 10px var(--btn-glow-a, rgba(37,99,235,0.40)); }
          50%      { box-shadow: 0 2px 18px var(--btn-glow-b, rgba(37,99,235,0.70)); }
        }
        @keyframes drBtnPop {
          0%   { transform: scale(1); }
          45%  { transform: scale(1.07); }
          100% { transform: scale(1); }
        }

        .dr-btn-secondary {
          height: 38px;
          padding: 0 18px;
          border-radius: 9px;
          border: 1px solid #dbeafe;
          background: linear-gradient(135deg,#f8fbff,#eef4ff);
          color: #2563eb;
          font-weight: 700;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(37,99,235,0.10);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
        }
        .dr-btn-secondary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.18); }
        .dr-btn-secondary:active:not(:disabled) { transform: translateY(0) scale(0.97); }
        .dr-btn-secondary:disabled { opacity: 0.6; cursor: default; }

        @media (prefers-reduced-motion: reduce) {
          .dr-rise, .dr-sync-flash, .dr-shimmer, .dr-card-glow,
          .dr-btn-primary, .dr-btn-primary.dr-btn-pop { animation: none; }
        }
      `}</style>
      </div>
      <SidebarDrawer
        open={open}
        toggleDrawer={() => setOpen(false)}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
    </>
  );
};

export default DailyRates;
