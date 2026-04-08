import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const dailyTraffic = [
  { date: "Aug 01", requests: 33935 },
  { date: "Aug 03", requests: 41334 },
  { date: "Aug 04", requests: 59491 },
  { date: "Aug 05", requests: 31831 },
  { date: "Aug 06", requests: 32377 },
  { date: "Aug 07", requests: 57297 },
  { date: "Aug 08", requests: 60006 },
  { date: "Aug 09", requests: 60436 },
  { date: "Aug 10", requests: 61118 },
  { date: "Aug 11", requests: 61169 },
  { date: "Aug 12", requests: 37991 },
  { date: "Aug 13", requests: 36435 },
  { date: "Aug 14", requests: 59808 },
  { date: "Aug 15", requests: 58786 },
  { date: "Aug 16", requests: 56600 },
  { date: "Aug 17", requests: 58954 },
  { date: "Aug 18", requests: 56204 },
  { date: "Aug 19", requests: 32052 },
  { date: "Aug 20", requests: 32927 },
  { date: "Aug 21", requests: 55459 },
  { date: "Aug 22", requests: 57673 },
  { date: "Aug 23", requests: 58027 },
  { date: "Aug 24", requests: 52487 },
  { date: "Aug 25", requests: 57299 },
  { date: "Aug 26", requests: 31576 },
  { date: "Aug 27", requests: 32774 },
  { date: "Aug 28", requests: 55416 },
  { date: "Aug 29", requests: 67856 },
  { date: "Aug 30", requests: 80552 },
  { date: "Aug 31", requests: 90035 },
];

const peakHourData = [
  { hour: "00", requests: 47632 },
  { hour: "01", requests: 38442 },
  { hour: "02", requests: 32478 },
  { hour: "03", requests: 29966 },
  { hour: "04", requests: 26749 },
  { hour: "05", requests: 27550 },
  { hour: "06", requests: 31258 },
  { hour: "07", requests: 47345 },
  { hour: "08", requests: 65423 },
  { hour: "09", requests: 78618 },
  { hour: "10", requests: 88234 },
  { hour: "11", requests: 95227 },
  { hour: "12", requests: 104989 },
  { hour: "13", requests: 104424 },
  { hour: "14", requests: 101237 },
  { hour: "15", requests: 109342 },
  { hour: "16", requests: 99441 },
  { hour: "17", requests: 80768 },
  { hour: "18", requests: 66715 },
  { hour: "19", requests: 59217 },
  { hour: "20", requests: 59835 },
  { hour: "21", requests: 57903 },
  { hour: "22", requests: 60590 },
  { hour: "23", requests: 54522 },
];

const topResources = [
  { url: "/images/nasa-logosmall.gif", count: 97269 },
  { url: "/images/ksc-logosmall.gif", count: 75278 },
  { url: "/images/mosaic-logosmall.gif", count: 67349 },
  { url: "/images/usa-logosmall.gif", count: 66968 },
  { url: "/images/world-logosmall.gif", count: 66345 },
  { url: "/images/ksclogo-medium.gif", count: 62663 },
  { url: "/ksc.html", count: 43629 },
  { url: "/history/apollo/images/apollo-logo1.gif", count: 37804 },
  { url: "/images/launch-logo.gif", count: 35116 },
  { url: "/", count: 30103 },
];

const errorData = [
  { ip: "155.148.25.4", errors: 44, status: 404 },
  { ip: "dialip-217.den.mmc.com", errors: 62, status: 404 },
  { ip: "163.135.192.101", errors: 25, status: 403 },
  { ip: "piweba3y.prodigy.com", errors: 47, status: 404 },
  { ip: "204.62.245.32", errors: 37, status: 404 },
  { ip: "dialup551.chicago.mci.net", errors: 18, status: 404 },
  { ip: "bass.hooked.net", errors: 18, status: 403 },
  { ip: "nexus.mlckew.edu.au", errors: 37, status: 404 },
  { ip: "tty18-23.swipnet.se", errors: 21, status: 403 },
  { ip: "user36.znet.com", errors: 21, status: 403 },
];

const errorStatusSplit = [
  { name: "404 Not Found", value: 2847, color: "#f59e0b" },
  { name: "403 Forbidden", value: 142, color: "#ef4444" },
  { name: "500/501 Server Error", value: 38, color: "#8b5cf6" },
];

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────

const theme = {
  bg: "#080b10",
  panel: "#111827",
  panelAlt: "#0f1117",
  panelSoft: "#0a0d13",
  border: "#1f2937",
  borderSoft: "#273244",
  text: "#f9fafb",
  textMuted: "#9ca3af",
  textSoft: "#6b7280",
  textFaint: "#4b5563",
  amber: "#f59e0b",
  orange: "#fb923c",
  green: "#22c55e",
  blue: "#3b82f6",
  red: "#ef4444",
  purple: "#8b5cf6",
};

const fonts = {
  display: "'Syne', sans-serif",
  body: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (n) =>
  n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M`
    : n >= 1000
    ? `${(n / 1000).toFixed(0)}K`
    : `${n}`;

const tableHeaderCell = {
  padding: "12px 18px",
  textAlign: "left",
  fontSize: 10,
  color: theme.textFaint,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontFamily: fonts.mono,
  fontWeight: 600,
};

const tableCell = {
  padding: "12px 18px",
  fontSize: 12,
  color: theme.text,
  fontFamily: fonts.body,
};

const cardBase = {
  background: `linear-gradient(180deg, ${theme.panel} 0%, ${theme.panelAlt} 100%)`,
  border: `1px solid ${theme.border}`,
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
};

const chartCard = {
  ...cardBase,
  padding: 24,
};

const axisTick = {
  fill: theme.textSoft,
  fontSize: 10,
  fontFamily: fonts.mono,
};

// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');

      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: ${theme.bg}; color: ${theme.text}; }

      button, input, select, textarea {
        font: inherit;
      }

      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: ${theme.panelAlt}; }
      ::-webkit-scrollbar-thumb { background: #374151; border-radius: 999px; }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.45; }
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .fade-in {
        animation: fadeIn 0.28s ease both;
      }

      @media (max-width: 1180px) {
        .overview-grid,
        .traffic-summary-grid,
        .error-kpi-grid,
        .resource-summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        .overview-charts-grid {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 820px) {
        .overview-grid,
        .traffic-summary-grid,
        .error-kpi-grid,
        .resource-summary-grid {
          grid-template-columns: 1fr !important;
        }

        .header-row {
          height: auto !important;
          padding: 16px 0;
          align-items: flex-start !important;
          flex-wrap: wrap;
          gap: 14px !important;
        }

        .nav-tabs {
          width: 100%;
          flex-wrap: wrap;
        }

        .wide-table-wrap {
          overflow-x: auto;
        }
      }
    `}</style>
  );
}

function SectionHeader({ title, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <h2
        style={{
          margin: 0,
          color: theme.text,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontFamily: fonts.display,
        }}
      >
        {title}
      </h2>

      {badge && (
        <span
          style={{
            background: theme.border,
            color: theme.amber,
            borderRadius: 999,
            padding: "4px 9px",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            fontFamily: fonts.mono,
          }}
        >
          {badge}
        </span>
      )}

      <div style={{ flex: 1, height: 1, background: theme.border }} />
    </div>
  );
}

function StatCard({ label, value, sub, accent = theme.amber, icon }) {
  return (
    <div
      style={{
        ...cardBase,
        position: "relative",
        overflow: "hidden",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: 3,
          background: accent,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              marginBottom: 8,
              color: theme.textSoft,
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: fonts.mono,
            }}
          >
            {label}
          </div>

          <div
            style={{
              color: theme.text,
              fontSize: 30,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              fontFamily: fonts.mono,
            }}
          >
            {value}
          </div>

          {sub && (
            <div
              style={{
                marginTop: 8,
                color: theme.textMuted,
                fontSize: 12,
                fontFamily: fonts.body,
              }}
            >
              {sub}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 24,
            lineHeight: 1,
            opacity: 0.4,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Panel({ children, style }) {
  return <div style={{ ...chartCard, ...style }}>{children}</div>;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: theme.panelAlt,
        border: `1px solid ${theme.borderSoft}`,
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          marginBottom: 6,
          color: theme.textMuted,
          fontSize: 12,
          fontFamily: fonts.body,
        }}
      >
        {label}
      </div>

      {payload.map((item, i) => (
        <div
          key={i}
          style={{
            marginTop: i === 0 ? 0 : 3,
            color: item.color || theme.amber,
            fontSize: 12,
            fontFamily: fonts.body,
          }}
        >
          {item.name}:{" "}
          <span
            style={{
              color: theme.text,
              fontWeight: 700,
              fontFamily: fonts.mono,
            }}
          >
            {item.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? theme.border : "transparent",
        color: active ? theme.amber : "#94a3b8",
        border: "1px solid transparent",
        padding: "8px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 11,
        fontWeight: active ? 700 : 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: fonts.mono,
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["overview", "traffic", "errors", "resources"];

  const totals = useMemo(() => {
    const totalRequests = dailyTraffic.reduce((sum, d) => sum + d.requests, 0);
    const peakDay = dailyTraffic.reduce((best, d) =>
      d.requests > best.requests ? d : best
    );
    const peakHour = peakHourData.reduce((best, d) =>
      d.requests > best.requests ? d : best
    );
    const totalErrors = errorData.reduce((sum, d) => sum + d.errors, 0);

    const weekendIndexes = [0, 6, 7, 12, 13, 18, 19, 25, 26];
    const weekdayAvg = Math.round(
      dailyTraffic
        .filter((_, i) => !weekendIndexes.includes(i))
        .reduce((sum, d) => sum + d.requests, 0) / 21
    );
    const weekendAvg = Math.round(
      dailyTraffic
        .filter((_, i) => weekendIndexes.includes(i))
        .reduce((sum, d) => sum + d.requests, 0) / 9
    );

    const totalTopResources = topResources.reduce((sum, d) => sum + d.count, 0);

    const resourceRows = topResources.map((r) => ({
      ...r,
      label: r.url.split("/").pop() || "/",
      pct: ((r.count / totalTopResources) * 100).toFixed(1),
    }));

    return {
      totalRequests,
      peakDay,
      peakHour,
      totalErrors,
      weekdayAvg,
      weekendAvg,
      totalTopResources,
      resourceRows,
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: fonts.body,
        lineHeight: 1.5,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      }}
    >
      <GlobalStyles />

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${theme.border}`,
          background: "rgba(8, 11, 16, 0.92)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="header-row"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: 28,
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            

            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              
            </div>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: theme.green,
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                color: theme.textSoft,
                fontSize: 10,
                letterSpacing: "0.08em",
                fontFamily: fonts.mono,
              }}
            >
              LIVE · AUG 1995
            </span>
          </div>

          <nav className="nav-tabs" style={{ display: "flex", gap: 6 }}>
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </nav>
        </div>
      </header>

      <main
        className="fade-in"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "28px 24px 48px",
        }}
      >
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              className="overview-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                label="Total Requests"
                value={fmt(totals.totalRequests)}
                sub="Aug 1995"
                icon="📊"
                accent={theme.amber}
              />
              <StatCard
                label="Peak Day"
                value={totals.peakDay.requests.toLocaleString()}
                sub={totals.peakDay.date}
                icon="📈"
                accent={theme.green}
              />
              <StatCard
                label="Peak Hour"
                value={totals.peakHour.requests.toLocaleString()}
                sub={`Hour ${totals.peakHour.hour}:00 UTC`}
                icon="⏱"
                accent={theme.blue}
              />
              <StatCard
                label="Error Events"
                value={totals.totalErrors}
                sub="Across top IPs"
                icon="⚠️"
                accent={theme.red}
              />
            </div>

            <div
              className="overview-charts-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
              }}
            >
              <Panel>
                <SectionHeader title="Daily Traffic Volume" badge="30d" />
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={dailyTraffic} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="overviewTrafficFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.amber} stopOpacity={0.28} />
                        <stop offset="95%" stopColor={theme.amber} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke={theme.border} />
                    <XAxis
                      dataKey="date"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      interval={4}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={fmt}
                      width={44}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      name="Requests"
                      stroke={theme.amber}
                      strokeWidth={2.25}
                      fill="url(#overviewTrafficFill)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <SectionHeader title="Error Distribution" />
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={errorStatusSplit}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={62}
                      innerRadius={36}
                      paddingAngle={3}
                    >
                      {errorStatusSplit.map((item, i) => (
                        <Cell key={i} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 8 }}>
                  {errorStatusSplit.map((item) => (
                    <div
                      key={item.name}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          color: theme.textMuted,
                          fontSize: 12,
                          fontFamily: fonts.body,
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          color: theme.text,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: fonts.mono,
                        }}
                      >
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <Panel>
              <SectionHeader title="Hourly Request Pattern" badge="24h" />
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={peakHourData} barGap={2} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={theme.border} vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(h) => `${h}h`}
                  />
                  <YAxis
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={fmt}
                    width={44}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="requests" name="Requests" radius={[4, 4, 0, 0]}>
                    {peakHourData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={
                          d.requests === totals.peakHour.requests
                            ? theme.amber
                            : d.requests > 80000
                            ? theme.orange
                            : d.requests > 60000
                            ? theme.blue
                            : theme.border
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div
                style={{
                  marginTop: 10,
                  textAlign: "right",
                  color: theme.textFaint,
                  fontSize: 11,
                  fontFamily: fonts.body,
                }}
              >
                🟡 Peak Hour &nbsp; 🟠 High &nbsp; 🔵 Medium &nbsp; ⬛ Low
              </div>
            </Panel>
          </div>
        )}

        {activeTab === "traffic" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Panel>
              <SectionHeader
                title="Daily Request Volume — August 1995"
                badge={`${dailyTraffic.length} days`}
              />
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={dailyTraffic} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trafficMainFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.blue} stopOpacity={0.32} />
                      <stop offset="95%" stopColor={theme.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={theme.border} />
                  <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={fmt}
                    width={46}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    name="Requests"
                    stroke={theme.blue}
                    strokeWidth={2.5}
                    fill="url(#trafficMainFill)"
                    dot={{ fill: theme.blue, r: 2.5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>

            <Panel>
              <SectionHeader title="Hourly Breakdown (All Days Combined)" />
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={peakHourData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={theme.border} />
                  <XAxis
                    dataKey="hour"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(h) => `${h}:00`}
                  />
                  <YAxis
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={fmt}
                    width={46}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    name="Requests"
                    stroke={theme.green}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            <div
              className="traffic-summary-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                label="Total Aug Requests"
                value={fmt(totals.totalRequests)}
                sub="Sum of 30 days"
                icon="🗄"
                accent={theme.blue}
              />
              <StatCard
                label="Avg Weekday Traffic"
                value={fmt(totals.weekdayAvg)}
                sub="Mon–Fri only"
                icon="📅"
                accent={theme.green}
              />
              <StatCard
                label="Weekend Traffic"
                value={fmt(totals.weekendAvg)}
                sub="Sat–Sun avg"
                icon="🛌"
                accent={theme.amber}
              />
            </div>
          </div>
        )}

        {activeTab === "errors" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              className="error-kpi-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                label="404 Not Found"
                value="2,847"
                sub="Most common error"
                icon="🚫"
                accent={theme.amber}
              />
              <StatCard
                label="403 Forbidden"
                value="142"
                sub="Access violations"
                icon="🔒"
                accent={theme.red}
              />
              <StatCard
                label="500/501 Errors"
                value="38"
                sub="Server failures"
                icon="💥"
                accent={theme.purple}
              />
            </div>

            <Panel>
              <SectionHeader title="Top Error-Generating IPs" badge={`${errorData.length} hosts`} />
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={errorData} layout="vertical" margin={{ top: 0, right: 16, left: 12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={theme.border} horizontal={false} />
                  <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="ip"
                    type="category"
                    width={210}
                    tick={{ ...axisTick, fill: theme.textMuted }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="errors" name="Error Count" radius={[0, 4, 4, 0]}>
                    {errorData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={
                          d.status === 403
                            ? theme.red
                            : d.status === 404
                            ? theme.amber
                            : theme.purple
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <div className="wide-table-wrap" style={{ ...cardBase, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${theme.border}` }}>
                <SectionHeader title="Error Log Details" />
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ background: theme.panelAlt }}>
                    {["IP / Hostname", "HTTP Status", "Error Count", "Severity"].map((h) => (
                      <th key={h} style={tableHeaderCell}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {errorData.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        borderTop: `1px solid ${theme.border}`,
                        background: i % 2 === 0 ? "transparent" : theme.panelSoft,
                      }}
                    >
                      <td style={{ ...tableCell, fontFamily: fonts.mono, color: "#e5e7eb" }}>
                        {row.ip}
                      </td>

                      <td style={tableCell}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: fonts.mono,
                            background:
                              row.status === 403
                                ? "#450a0a"
                                : row.status === 404
                                ? "#451a03"
                                : "#2e1065",
                            color:
                              row.status === 403
                                ? theme.red
                                : row.status === 404
                                ? theme.amber
                                : "#a78bfa",
                          }}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          fontFamily: fonts.mono,
                          fontWeight: 700,
                        }}
                      >
                        {row.errors}
                      </td>

                      <td style={tableCell}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div
                              key={j}
                              style={{
                                width: 14,
                                height: 5,
                                borderRadius: 3,
                                background:
                                  j < Math.ceil(row.errors / 15)
                                    ? row.status === 403
                                      ? theme.red
                                      : theme.amber
                                    : theme.border,
                              }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Panel>
              <SectionHeader title="Top 10 Most Accessed Resources" badge="Aug 1995" />
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={totals.resourceRows}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="resourceBarFill" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={theme.amber} stopOpacity={1} />
                      <stop offset="100%" stopColor={theme.orange} stopOpacity={0.72} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={theme.border} horizontal={false} />
                  <XAxis
                    type="number"
                    tick={axisTick}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={fmt}
                  />
                  <YAxis
                    dataKey="label"
                    type="category"
                    width={180}
                    tick={{ ...axisTick, fill: theme.textMuted }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Requests"
                    fill="url(#resourceBarFill)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <div className="wide-table-wrap" style={{ ...cardBase, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${theme.border}` }}>
                <SectionHeader title="Resource Access Log" />
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr style={{ background: theme.panelAlt }}>
                    {["#", "Resource URL", "Request Count", "% of Top 10"].map((h) => (
                      <th key={h} style={tableHeaderCell}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {totals.resourceRows.map((row, i) => (
                    <tr
                      key={row.url}
                      style={{
                        borderTop: `1px solid ${theme.border}`,
                        background: i % 2 === 0 ? "transparent" : theme.panelSoft,
                      }}
                    >
                      <td style={{ ...tableCell, color: theme.textSoft, fontFamily: fonts.mono }}>
                        #{i + 1}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          color: "#60a5fa",
                          fontFamily: fonts.mono,
                        }}
                      >
                        {row.url}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          fontFamily: fonts.mono,
                          fontWeight: 700,
                        }}
                      >
                        {row.count.toLocaleString()}
                      </td>

                      <td style={tableCell}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              flex: 1,
                              height: 5,
                              background: theme.border,
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${row.pct}%`,
                                height: "100%",
                                background: theme.amber,
                                borderRadius: 999,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              width: 38,
                              textAlign: "right",
                              fontSize: 11,
                              color: theme.textMuted,
                              fontFamily: fonts.mono,
                            }}
                          >
                            {row.pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="resource-summary-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                label="#1 Resource"
                value="97,269"
                sub="/images/nasa-logosmall.gif"
                icon="🖼"
                accent={theme.amber}
              />
              <StatCard
                label="Top 10 Total"
                value={fmt(totals.totalTopResources)}
                sub="Combined resource requests"
                icon="📦"
                accent={theme.blue}
              />
              <StatCard
                label="Homepage Rank"
                value="#10"
                sub='"/" among top resources'
                icon="🏠"
                accent={theme.green}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}