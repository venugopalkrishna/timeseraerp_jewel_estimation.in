import {
  CloseOutlined,
  FileSearchOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Empty, Input, Modal, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../Config/Config";

const { RangePicker } = DatePicker;

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

/* hex → rgba, so one palette value can drive solid + translucent uses */
const hexA = (hex, a) => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/* ── PALETTES ────────────────────────────────────────────────────────────
   Swap the active palette on the `const C = ...` line below.             */
const PALETTES = {
  /* Emerald & Copper — deep forest green with warm copper accents */
  emerald: {
    page: "#F1F5F2",
    cardBg: "#F8FBF9",
    cardBorder: "#CFE0D6",
    strip: "#E4EFE8",
    dark: "#123B2E",
    onDark: "#EAF3ED",
    accent: "#B87333",
    accentLight: "#E8B583",
    label: "#8C4A2F",
    ink: "#12211B",
    muted: "#7C9187",
    pos: "#0F766E",
    badgeFrom: "#B87333",
    badgeTo: "#7A4318",
    danger: "#E8A0A0",
  },

  /* Plum & Rose Gold — aubergine with soft rose highlights */
  plum: {
    page: "#F6F1F5",
    cardBg: "#FBF7FA",
    cardBorder: "#E0CFDC",
    strip: "#EFE4EC",
    dark: "#2E1B3B",
    onDark: "#EFE6F0",
    accent: "#C08552",
    accentLight: "#EFC79A",
    label: "#8A2C5E",
    ink: "#241B2A",
    muted: "#9C8BA0",
    pos: "#166534",
    badgeFrom: "#6D3A7A",
    badgeTo: "#3F1F4A",
    danger: "#E9A6A6",
  },

  /* Slate & Amber — neutral charcoal with amber accents */
  slate: {
    page: "#F4F4F1",
    cardBg: "#FAFAF7",
    cardBorder: "#DCDAD0",
    strip: "#EBE9E0",
    dark: "#262B33",
    onDark: "#EDEDE8",
    accent: "#D98E32",
    accentLight: "#F2C48A",
    label: "#9A5B2E",
    ink: "#1F2229",
    muted: "#8C8B82",
    pos: "#15803D",
    badgeFrom: "#3D4552",
    badgeTo: "#1C2029",
    danger: "#E9A6A6",
  },
};

const C = PALETTES.emerald; // ← change to PALETTES.plum or PALETTES.slate

const EstimationPurchaseSelectDialog = ({ open, onCancel, onSelect }) => {
  const tenantName = localStorage.getItem("tenantName");
  const searchInputRef = useRef(null);

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dates, setDates] = useState(null); // null = no date filter
  const [selectedEstNo, setSelectedEstNo] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=ESTIMATION_PURCHASES`,
        { headers: { tenantName } },
      );
      setRawData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("EstimationPurchaseSelectDialog fetch error:", err);
      setRawData([]);
    } finally {
      setLoading(false);
    }
  }, [tenantName]);

  useEffect(() => {
    if (open) {
      fetchData();
      setSearchText("");
      setDates(null);
      setSelectedEstNo(null);
      setTimeout(() => searchInputRef.current?.focus(), 200);
    }
  }, [open, fetchData]);

  // ── group flat rows by EstimationNo ─────────────────────────────
  const groups = Object.values(
    rawData.reduce((acc, item) => {
      const key = item.EstimationNo;
      if (!acc[key]) {
        acc[key] = {
          estimationNo: key,
          items: [],
          estDate: item.EstDate,
          netAmt: item.NetAmt,
          grossAmt: item.GrossAmt,
          ptaxPer: item.Ptaxper,
          billNo: item.BillNo,
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {}),
  )
    .map((g) => ({
      ...g,
      pieces: g.items.length,
      totalGwt: g.items.reduce((s, i) => s + num(i.Gwt), 0),
      totalNwt: g.items.reduce((s, i) => s + num(i.Nwt), 0),
    }))
    .sort((a, b) => Number(b.estimationNo) - Number(a.estimationNo));

  const filtered = groups.filter((g) => {
    const estMatch = searchText
      ? String(g.estimationNo).includes(searchText)
      : true;

    let dateMatch = true;
    if (dates && dates[0] && dates[1] && g.estDate) {
      const d = dayjs(g.estDate).valueOf();
      dateMatch =
        d >= dates[0].startOf("day").valueOf() &&
        d <= dates[1].endOf("day").valueOf();
    }
    return estMatch && dateMatch;
  });

  const hasActiveFilter = !!searchText || !!dates;

  const handleClearFilters = () => {
    setSearchText("");
    setDates(null);
  };

  const closeDialog = () => {
    onCancel?.();
  };

  const handleSelectRecord = (group) => {
    setSelectedEstNo(group.estimationNo);
    onSelect?.(group);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length === 1) {
        handleSelectRecord(filtered[0]);
      } else {
        const exact = filtered.find(
          (g) => String(g.estimationNo) === searchText,
        );
        if (exact) handleSelectRecord(exact);
      }
    }
  };

  /* small stat cell used inside each card */
  const Stat = ({ label, value, pos }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: "clamp(8.5px,2.1vw,10px)",
          fontWeight: 700,
          color: C.muted,
          letterSpacing: 0.6,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "clamp(12.5px,3.3vw,15px)",
          color: pos ? C.pos : C.ink,
        }}
      >
        {value}
      </span>
    </div>
  );

  /* reusable icon-button look for the header controls */
  const headerBtn = (tone) => ({
    color: tone === "danger" ? C.danger : C.onDark,
    width: 32,
    height: 32,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    background: hexA(C.onDark, 0.08),
    border: `1px solid ${
      tone === "danger" ? hexA(C.danger, 0.35) : hexA(C.onDark, 0.18)
    }`,
    flexShrink: 0,
  });

  return (
    <Modal
      open={open}
      onCancel={closeDialog}
      footer={null}
      closable={false}
      centered
      width="min(860px, 94vw)"
      styles={{
        body: { padding: 0 },
        content: {
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: `0 24px 64px ${hexA(C.ink, 0.28)}`,
          border: `1.5px solid ${C.cardBorder}`,
          padding: 0,
          background: C.page,
        },
        mask: {
          backdropFilter: "blur(6px)",
          backgroundColor: hexA(C.dark, 0.3),
        },
      }}
    >
      <style>{`
        @keyframes epsd-fadein { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes epsd-rowin  { from { opacity:0; transform:translateY(6px); }  to { opacity:1; transform:translateY(0); } }
        .epsd-body { animation: epsd-fadein 0.24s ease both; font-family:'Work Sans', sans-serif; }

        .epsd-card {
          background:${C.cardBg};
          border:1.5px solid ${C.cardBorder};
          border-radius:14px;
          overflow:hidden;
          cursor:pointer;
          margin-bottom:12px;
          box-shadow:0 2px 8px ${hexA(C.ink, 0.06)};
          transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
          animation: epsd-rowin .2s ease both;
        }
        .epsd-card:hover {
          transform:translateY(-2px);
          border-color:${C.accent};
          box-shadow:0 8px 18px ${hexA(C.ink, 0.14)};
        }
        .epsd-card.selected {
          outline:2px solid ${C.accent};
          outline-offset:-1px;
          box-shadow:0 8px 20px ${hexA(C.accent, 0.3)};
        }

        .epsd-scroll::-webkit-scrollbar { width: 6px; }
        .epsd-scroll::-webkit-scrollbar-track { background: transparent; }
        .epsd-scroll::-webkit-scrollbar-thumb { background:${C.cardBorder}; border-radius:10px; }
        .epsd-scroll::-webkit-scrollbar-thumb:hover { background:${C.accent}; }
        .epsd-filter input { border-radius:8px !important; font-size:0.78rem !important; }

        /* accent-tinted calendar */
        .epsd-picker .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
        .epsd-picker .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
        .epsd-picker .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
          background:${C.accent} !important;
        }
        .epsd-picker .ant-picker-cell-in-view.ant-picker-cell-in-range::before,
        .epsd-picker .ant-picker-cell-in-view.ant-picker-cell-range-hover::before {
          background:${hexA(C.accent, 0.14)} !important;
        }
        .epsd-picker .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
          border-color:${C.accent} !important;
        }

        /* ── date picker popup: never wider than the phone ───────────── */
        .epsd-picker { max-width: 94vw; }
        .epsd-picker .ant-picker-panel-container {
          max-width: 94vw;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 12px 32px ${hexA(C.ink, 0.22)};
        }
        @media (max-width: 680px) {
          /* stack the two months instead of placing them side by side */
          .epsd-picker .ant-picker-panels {
            flex-direction: column !important;
            max-width: 94vw;
          }
          .epsd-picker .ant-picker-panels > *:last-child {
            border-top: 1px solid ${C.cardBorder};
          }
          .epsd-picker .ant-picker-date-panel,
          .epsd-picker .ant-picker-content { width: auto !important; }
          .epsd-picker .ant-picker-cell-inner {
            min-width: 26px !important;
            height: 26px !important;
            line-height: 26px !important;
            font-size: 12px !important;
          }
          .epsd-picker .ant-picker-content th {
            width: 26px !important;
            font-size: 11px !important;
          }
          .epsd-picker .ant-picker-header { padding: 0 6px !important; line-height: 32px !important; }
          .epsd-picker .ant-picker-header-view { font-size: 13px !important; }
          .epsd-picker .ant-picker-body { padding: 6px 8px !important; }
          /* hide the arrow that points at a now-offscreen input edge */
          .epsd-picker .ant-picker-range-arrow { display: none !important; }
        }
      `}</style>

      <div className="epsd-body">
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div
          style={{
            background: C.dark,
            padding: "clamp(14px,3.6vw,18px) clamp(16px,4vw,22px)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: hexA(C.accent, 0.12),
            }}
          />
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              background: hexA(C.onDark, 0.08),
              border: `1.5px solid ${hexA(C.accent, 0.4)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileSearchOutlined
              style={{ color: C.accentLight, fontSize: 19 }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(15px,4vw,18px)",
                fontWeight: 700,
                color: C.onDark,
                letterSpacing: "0.3px",
              }}
            >
              Estimation Purchases
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                color: C.accentLight,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {loading
                ? "Loading estimations…"
                : `${filtered.length} of ${groups.length} estimations`}
            </div>
          </div>

          <Button
            type="text"
            onClick={fetchData}
            title="Refresh"
            style={headerBtn()}
          >
            <ReloadOutlined style={{ fontSize: 13 }} />
          </Button>
          <Button
            type="text"
            onClick={closeDialog}
            title="Close"
            style={headerBtn("danger")}
          >
            <CloseOutlined style={{ fontSize: 13 }} />
          </Button>
        </div>

        {/* ── FILTER BAR ─────────────────────────────────────────── */}
        <div
          style={{
            background: C.cardBg,
            padding: "11px clamp(14px,4vw,18px)",
            display: "flex",
            gap: 10,
            alignItems: "center",
            borderBottom: `1.5px solid ${C.cardBorder}`,
            flexWrap: "wrap",
          }}
        >
          <RangePicker
            className="epsd-filter"
            popupClassName="epsd-picker"
            size="small"
            inputReadOnly
            value={dates}
            onChange={(values) => setDates(values)}
            format="DD-MM-YYYY"
            allowClear
            placeholder={["From date", "To date"]}
            style={{ flex: 1.1, minWidth: 200, borderRadius: 8 }}
            maxDate={dayjs()}
            disabledDate={(current) =>
              current && current.isAfter(dayjs().endOf("day"))
            }
          />
          <Input
            className="epsd-filter"
            ref={searchInputRef}
            prefix={<SearchOutlined style={{ color: C.muted, fontSize: 12 }} />}
            placeholder="Estimation no…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.replace(/\D/g, ""))}
            onKeyDown={handleSearchKeyDown}
            onFocus={(e) => e.target.select()}
            allowClear
            style={{ flex: 0.8, minWidth: 130 }}
          />
          {hasActiveFilter && (
            <Button
              type="text"
              onClick={handleClearFilters}
              style={{
                height: 32,
                padding: "0 12px",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: C.label,
                border: `1.5px solid ${C.cardBorder}`,
                borderRadius: 8,
                background: "#fff",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <CloseOutlined style={{ fontSize: 10 }} /> Clear
            </Button>
          )}
        </div>

        {/* ── CARD LIST ──────────────────────────────────────────── */}
        <div
          className="epsd-scroll"
          style={{
            background: C.page,
            padding: "14px clamp(14px,4vw,18px) 6px",
            maxHeight: "min(52vh, 460px)",
            overflowY: "auto",
          }}
        >
          <Spin spinning={loading} tip="Loading estimations…">
            {!loading && filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "clamp(22px,6vw,34px)",
                  background: C.cardBg,
                  border: `1.5px dashed ${C.cardBorder}`,
                  borderRadius: 14,
                  marginBottom: 12,
                }}
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span style={{ fontSize: "0.8rem", color: C.muted }}>
                      {groups.length === 0
                        ? "No estimations found"
                        : "No estimations match these filters"}
                    </span>
                  }
                  style={{ margin: 0 }}
                >
                  {hasActiveFilter && (
                    <Button
                      size="small"
                      onClick={handleClearFilters}
                      style={{
                        borderRadius: 8,
                        fontWeight: 700,
                        border: `1.5px solid ${C.cardBorder}`,
                        color: C.label,
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </Empty>
              </div>
            )}

            {filtered.map((g, idx) => {
              const isSelected = selectedEstNo === g.estimationNo;
              return (
                <div
                  key={`${g.estimationNo}-${idx}`}
                  className={`epsd-card${isSelected ? " selected" : ""}`}
                  style={{ animationDelay: `${Math.min(idx * 0.025, 0.4)}s` }}
                  onClick={() => handleSelectRecord(g)}
                >
                  {/* card header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "clamp(9px,2.6vw,12px) clamp(11px,3vw,14px)",
                      background: C.dark,
                    }}
                  >
                    <span
                      style={{
                        minWidth: 30,
                        height: 30,
                        padding: "0 6px",
                        flexShrink: 0,
                        borderRadius: 15,
                        background: `radial-gradient(circle at 32% 28%,${C.badgeFrom},${C.badgeTo})`,
                        boxShadow: `inset 0 0 0 1.5px ${hexA(
                          C.accentLight,
                          0.55,
                        )}`,
                        color: C.onDark,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      #{g.estimationNo}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 700,
                          fontSize: "clamp(13px,3.6vw,15px)",
                          color: C.onDark,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {g.items.map((i) => i.ProductName).join(", ") || "—"}
                      </div>
                      <div
                        style={{
                          fontSize: "clamp(9px,2.2vw,10px)",
                          color: C.accentLight,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          marginTop: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {g.pieces} item{g.pieces > 1 ? "s" : ""} ·{" "}
                        {g.estDate
                          ? dayjs(g.estDate).format("DD-MM-YYYY")
                          : "—"}
                      </div>
                    </div>

                    <span
                      style={{
                        width: 26,
                        height: 26,
                        flexShrink: 0,
                        borderRadius: "50%",
                        background: isSelected
                          ? hexA(C.accent, 0.28)
                          : hexA(C.onDark, 0.08),
                        border: `1px solid ${
                          isSelected
                            ? hexA(C.accent, 0.6)
                            : hexA(C.onDark, 0.18)
                        }`,
                        color: isSelected ? C.accentLight : C.onDark,
                        fontSize: 12,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected ? "✓" : "›"}
                    </span>
                  </div>

                  {/* card stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: "clamp(7px,2vw,10px)",
                      padding: "clamp(10px,3vw,14px) clamp(11px,3vw,14px)",
                    }}
                  >
                    <Stat label="PIECES" value={g.pieces} />
                    <Stat label="G.WT" value={g.totalGwt.toFixed(3)} />
                    <Stat label="N.WT" value={g.totalNwt.toFixed(3)} pos />
                    <Stat
                      label="GROSS"
                      value={Number(g.grossAmt || 0).toLocaleString("en-IN")}
                    />
                  </div>

                  {/* card total strip */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "clamp(8px,2.4vw,11px) clamp(11px,3vw,14px)",
                      background: C.strip,
                      borderTop: `1px dashed ${C.accent}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "clamp(10px,2.6vw,12px)",
                        fontWeight: 700,
                        color: C.label,
                        letterSpacing: 0.8,
                      }}
                    >
                      NET AMT
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 800,
                        fontSize: "clamp(15px,4vw,18px)",
                        color: C.dark,
                      }}
                    >
                      ₹
                      {Number(g.netAmt || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                      })}
                      /-
                    </span>
                  </div>
                </div>
              );
            })}
          </Spin>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <div
          style={{
            padding: "clamp(10px,3vw,13px) clamp(16px,4vw,20px)",
            paddingBottom:
              "calc(clamp(10px,3vw,13px) + env(safe-area-inset-bottom))",
            background: C.dark,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: "0.68rem",
              color: hexA(C.onDark, 0.55),
            }}
          >
            Tap a card to load that estimation for editing
          </span>
          <Button
            onClick={closeDialog}
            style={{
              height: 34,
              background: "transparent",
              border: `1.5px solid ${hexA(C.onDark, 0.4)}`,
              color: C.onDark,
              borderRadius: 20,
              fontWeight: 700,
              fontSize: "0.78rem",
              padding: "0 18px",
              flexShrink: 0,
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EstimationPurchaseSelectDialog;
