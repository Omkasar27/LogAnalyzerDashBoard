import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// ─── DATA ────────────────────────────────────────────────────────────────────

const dailyTraffic = [
  { date: "Aug 01", r: 33935 }, { date: "Aug 03", r: 41334 }, { date: "Aug 04", r: 59491 },
  { date: "Aug 05", r: 31831 }, { date: "Aug 06", r: 32377 }, { date: "Aug 07", r: 57297 },
  { date: "Aug 08", r: 60006 }, { date: "Aug 09", r: 60436 }, { date: "Aug 10", r: 61118 },
  { date: "Aug 11", r: 61169 }, { date: "Aug 12", r: 37991 }, { date: "Aug 13", r: 36435 },
  { date: "Aug 14", r: 59808 }, { date: "Aug 15", r: 58786 }, { date: "Aug 16", r: 56600 },
  { date: "Aug 17", r: 58954 }, { date: "Aug 18", r: 56204 }, { date: "Aug 19", r: 32052 },
  { date: "Aug 20", r: 32927 }, { date: "Aug 21", r: 55459 }, { date: "Aug 22", r: 57673 },
  { date: "Aug 23", r: 58027 }, { date: "Aug 24", r: 52487 }, { date: "Aug 25", r: 57299 },
  { date: "Aug 26", r: 31576 }, { date: "Aug 27", r: 32774 }, { date: "Aug 28", r: 55416 },
  { date: "Aug 29", r: 67856 }, { date: "Aug 30", r: 80552 }, { date: "Aug 31", r: 90035 },
];

// CHANGE 1: Annotation data for the spike
const spikeAnnotation = {
  dateIndex: 27, // Aug 28 (start of spike)
  label: "STS-69 Launch",
  detail: "Space Shuttle Endeavour launched Sep 7; pre-launch coverage drove Aug 29–31 traffic spike (+62%)",
};

const hourlyData = [
  { h: "00", r: 47632 }, { h: "01", r: 38442 }, { h: "02", r: 32478 }, { h: "03", r: 29966 },
  { h: "04", r: 26749 }, { h: "05", r: 27550 }, { h: "06", r: 31258 }, { h: "07", r: 47345 },
  { h: "08", r: 65423 }, { h: "09", r: 78618 }, { h: "10", r: 88234 }, { h: "11", r: 95227 },
  { h: "12", r: 104989 }, { h: "13", r: 104424 }, { h: "14", r: 101237 }, { h: "15", r: 109342 },
  { h: "16", r: 99441 }, { h: "17", r: 80768 }, { h: "18", r: 66715 }, { h: "19", r: 59217 },
  { h: "20", r: 59835 }, { h: "21", r: 57903 }, { h: "22", r: 60590 }, { h: "23", r: 54522 },
];

// CHANGE 2: Separate HTML pages from image assets in resources
const topRes = [
  { url: "/images/nasa-logosmall.gif",              n: 97269,  type: "asset" },
  { url: "/images/ksc-logosmall.gif",               n: 75278,  type: "asset" },
  { url: "/images/mosaic-logosmall.gif",            n: 67349,  type: "asset" },
  { url: "/images/usa-logosmall.gif",               n: 66968,  type: "asset" },
  { url: "/images/world-logosmall.gif",             n: 66345,  type: "asset" },
  { url: "/images/ksclogo-medium.gif",              n: 62663,  type: "asset" },
  { url: "/ksc.html",                               n: 43629,  type: "page"  },
  { url: "/history/apollo/images/apollo-logo1.gif", n: 37804,  type: "asset" },
  { url: "/images/launch-logo.gif",                 n: 35116,  type: "asset" },
  { url: "/",                                       n: 30103,  type: "page"  },
];

const errorIPs = [
  { ip: "dialip-217.den.mmc.com",    e: 62, s: 404, org: "MediaMarket Co."       },
  { ip: "piweba3y.prodigy.com",      e: 47, s: 404, org: "Prodigy Services"      },
  { ip: "155.148.25.4",              e: 44, s: 404, org: "Unknown / Residential" },
  { ip: "204.62.245.32",             e: 37, s: 404, org: "Unknown / Residential" },
  { ip: "nexus.mlckew.edu.au",       e: 37, s: 404, org: "Macleay Coll. (AU)"    },
  { ip: "163.135.192.101",           e: 25, s: 403, org: "Unknown"               },
  { ip: "tty18-23.swipnet.se",       e: 21, s: 403, org: "Swipnet SE"            },
  { ip: "user36.znet.com",           e: 21, s: 403, org: "Znet ISP"              },
  { ip: "dialup551.chicago.mci.net", e: 18, s: 404, org: "MCI Chicago"           },
  { ip: "bass.hooked.net",           e: 18, s: 403, org: "Hooked.net ISP"        },
];

const errorStatusSplit = [
  { name: "404 Not Found", value: 2847, color: "#d29922" },
  { name: "403 Forbidden", value: 142,  color: "#f85149" },
  { name: "500/501 Errors", value: 38,  color: "#bc8cff" },
];

// CHANGE 3: Success/status breakdown for success rate calculation
const totalRequests    = dailyTraffic.reduce((s, d) => s + d.r, 0); // 1,569,000 approx
const totalErrors      = 2847 + 142 + 38; // 3027
const successRate      = (((totalRequests - totalErrors) / totalRequests) * 100).toFixed(2);
const errorRatePct     = ((totalErrors / totalRequests) * 100).toFixed(3);
const notFoundRatePct  = ((2847 / totalRequests) * 100).toFixed(3);

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const C = {
  bg: "#0d1117", surface: "#161b22", surface2: "#1c2128",
  border: "#30363d", text: "#e6edf3", muted: "#7d8590", hint: "#484f58",
  blue: "#58a6ff", green: "#3fb950", amber: "#d29922",
  red: "#f85149", purple: "#bc8cff", orange: "#fb923c",
};

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const SANS = "'Inter', ui-sans-serif, system-ui, sans-serif";

const fmt = (n) =>
  n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(0) + "K" : "" + n;

const weekendIdx = new Set([0, 6, 7, 12, 13, 18, 19, 25, 26]);
const peakDay   = dailyTraffic.reduce((b, d) => (d.r > b.r ? d : b));
const peakHour  = hourlyData.reduce((b, d) => (d.r > b.r ? d : b));
const totalTopRes = topRes.reduce((s, d) => s + d.n, 0);
const wdAvg = Math.round(dailyTraffic.filter((_, i) => !weekendIdx.has(i)).reduce((s, d) => s + d.r, 0) / 21);
const weAvg = Math.round(dailyTraffic.filter((_, i) => weekendIdx.has(i)).reduce((s, d) => s + d.r, 0) / 9);

// ─── STYLES ──────────────────────────────────────────────────────────────────

const s = {
  app: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: SANS, fontSize: 13, lineHeight: 1.6 },
  header: {
    background: C.surface, borderBottom: `1px solid ${C.border}`,
    padding: "0 20px", display: "flex", alignItems: "center",
    gap: 16, height: 52, position: "sticky", top: 0, zIndex: 50,
  },
  logo: { display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 13, fontWeight: 600, color: C.blue },
  logoIcon: {
    width: 22, height: 22, background: C.blue, borderRadius: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  liveBadge: { display: "flex", alignItems: "center", gap: 5, fontFamily: MONO, fontSize: 10, color: C.muted, marginLeft: "auto" },
  liveDot: { width: 6, height: 6, borderRadius: "50%", background: C.green },
  nav: { display: "flex", gap: 2 },
  main: { padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  panel: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 },
  panelTitle: {
    fontFamily: MONO, fontSize: 11, fontWeight: 600, textTransform: "uppercase",
    letterSpacing: "0.1em", color: C.muted, marginBottom: 14,
    display: "flex", alignItems: "center", gap: 8,
  },
  badge: { fontSize: 10, background: C.surface2, color: C.blue, borderRadius: 4, padding: "2px 7px" },
  kpiRow: (cols = 4) => ({ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }),
  row2: { display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 12 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontFamily: MONO, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
    color: C.hint, padding: "8px 12px", textAlign: "left",
    borderBottom: `1px solid ${C.border}`, fontWeight: 500,
  },
  td: { padding: "8px 12px", fontSize: 12, borderBottom: `1px solid rgba(48,54,61,0.5)` },
  monoTd: { padding: "8px 12px", fontSize: 11, fontFamily: MONO, borderBottom: `1px solid rgba(48,54,61,0.5)` },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function LogoIcon() {
  return (
    <div style={s.logoIcon}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill={C.bg}>
        <rect x="0" y="0" width="5" height="5" rx="1" />
        <rect x="7" y="0" width="5" height="5" rx="1" />
        <rect x="0" y="7" width="5" height="5" rx="1" />
        <rect x="7" y="7" width="5" height="5" rx="1" />
      </svg>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "rgba(88,166,255,.12)" : "none",
        color: active ? C.blue : C.muted,
        border: "none", padding: "6px 12px", borderRadius: 6,
        fontFamily: MONO, fontSize: 11, fontWeight: 500, cursor: "pointer",
        textTransform: "uppercase", letterSpacing: "0.08em",
      }}
    >
      {children}
    </button>
  );
}

function KpiCard({ label, value, sub, accent = C.blue, highlight = false }) {
  return (
    <div style={{
      background: highlight ? `rgba(63,185,80,0.06)` : C.surface,
      border: `1px solid ${highlight ? C.green : C.border}`,
      borderRadius: 8, padding: "14px 16px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent }} />
      <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: highlight ? C.green : C.text, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: C.hint, marginTop: 5 }}>{sub}</div>
    </div>
  );
}

function PanelTitle({ children, badge }) {
  return (
    <div style={s.panelTitle}>
      {children}
      {badge && <span style={s.badge}>{badge}</span>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    404: { bg: "rgba(210,153,34,.12)", color: C.amber },
    403: { bg: "rgba(248,81,73,.12)", color: C.red },
    500: { bg: "rgba(188,140,255,.12)", color: C.purple },
  };
  const style = map[status] || map[500];
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      fontFamily: MONO, fontSize: 10, fontWeight: 600,
      background: style.bg, color: style.color,
    }}>
      {status}
    </span>
  );
}

function SeverityBar({ count, status }) {
  const filled = Math.ceil(count / 15);
  const onColor = status === 403 ? C.red : C.amber;
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{
          width: 12, height: 4, borderRadius: 2,
          background: i < filled ? onColor : C.border,
        }} />
      ))}
    </div>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
      {items.map(({ color, label }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
          {label}
        </div>
      ))}
    </div>
  );
}

// CHANGE 4: Insight callout box
function InsightBox({ color = C.amber, icon = "⚑", children }) {
  return (
    <div style={{
      background: `rgba(210,153,34,0.06)`, border: `1px solid rgba(210,153,34,0.25)`,
      borderLeft: `3px solid ${color}`, borderRadius: 6,
      padding: "10px 14px", fontSize: 12, color: C.muted, lineHeight: 1.6,
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <span style={{ color, fontSize: 13, marginTop: 1 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

// CHANGE 5: Resource type pill
function TypePill({ type }) {
  const isPage = type === "page";
  return (
    <span style={{
      display: "inline-block", padding: "2px 7px", borderRadius: 4,
      fontFamily: MONO, fontSize: 9, fontWeight: 600, textTransform: "uppercase",
      background: isPage ? "rgba(88,166,255,.12)" : "rgba(125,133,144,.10)",
      color: isPage ? C.blue : C.hint,
    }}>
      {isPage ? "page" : "asset"}
    </span>
  );
}

// ─── CHART HOOK ──────────────────────────────────────────────────────────────

const axTick = { color: C.hint, font: { family: MONO, size: 10 } };
const gridColor = "rgba(48,54,61,0.6)";

// ─── TABS ────────────────────────────────────────────────────────────────────

function Overview() {
  const c1 = useRef(null);
  const c2 = useRef(null);
  const c3 = useRef(null);

  useEffect(() => {
    const charts = [];

    // CHANGE 6: Spike annotation plugin baked into daily chart
    const spikePlugin = {
      id: "spikeAnnotation",
      afterDraw(chart) {
        const { ctx, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;
        const spikeX = xScale.getPixelForValue(27); // Aug 28 index
        const top = yScale.top;
        const bottom = yScale.bottom;
        ctx.save();
        ctx.strokeStyle = "rgba(210,153,34,0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(spikeX, top);
        ctx.lineTo(spikeX, bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        // Label
        ctx.fillStyle = "rgba(210,153,34,0.9)";
        ctx.font = `600 9px ${MONO}`;
        ctx.textAlign = "left";
        ctx.fillText("STS-69 coverage ↑", spikeX + 5, top + 12);
        ctx.restore();
      },
    };

    charts.push(new Chart(c1.current, {
      type: "line",
      plugins: [spikePlugin],
      data: {
        labels: dailyTraffic.map((d) => d.date),
        datasets: [{
          label: "Requests", data: dailyTraffic.map((d) => d.r),
          borderColor: C.blue, backgroundColor: "rgba(88,166,255,.08)",
          borderWidth: 1.5, pointRadius: 0, tension: 0.35, fill: true,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { ...axTick, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, grid: { color: "rgba(48,54,61,.3)" }, border: { display: false } },
          y: { ticks: { ...axTick, callback: (v) => fmt(v) }, grid: { color: gridColor }, border: { display: false } },
        },
      },
    }));

    charts.push(new Chart(c2.current, {
      type: "doughnut",
      data: {
        labels: errorStatusSplit.map((d) => d.name),
        datasets: [{
          data: errorStatusSplit.map((d) => d.value),
          backgroundColor: errorStatusSplit.map((d) => d.color),
          borderWidth: 2, borderColor: C.surface,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "62%",
        plugins: { legend: { display: false } },
      },
    }));

    charts.push(new Chart(c3.current, {
      type: "bar",
      data: {
        labels: hourlyData.map((d) => d.h + "h"),
        datasets: [{
          label: "Requests",
          data: hourlyData.map((d) => d.r),
          backgroundColor: hourlyData.map((d) =>
            d.r === peakHour.r ? C.amber : d.r > 80000 ? C.orange : d.r > 60000 ? C.blue : C.border
          ),
          borderRadius: 3, borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              // CHANGE 7: Tooltip shows UTC + Eastern time
              title: (items) => {
                const h = parseInt(items[0].label);
                const eastern = ((h - 5 + 24) % 24);
                const ampm = eastern >= 12 ? "PM" : "AM";
                const h12 = eastern % 12 || 12;
                return `${items[0].label} UTC  (${h12}:00 ${ampm} ET)`;
              },
            },
          },
        },
        scales: {
          x: { ticks: axTick, grid: { display: false }, border: { display: false } },
          y: { ticks: { ...axTick, callback: (v) => fmt(v) }, grid: { color: gridColor }, border: { display: false } },
        },
      },
    }));

    return () => charts.forEach((c) => c.destroy());
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* CHANGE 8: Success rate KPI added as the primary card */}
      <div style={s.kpiRow(5)}>
        <KpiCard label="Success Rate" value={`${successRate}%`} sub="2xx responses est." accent={C.green} highlight />
        <KpiCard label="Total Requests" value={fmt(totalRequests)} sub="August 1995" accent={C.blue} />
        <KpiCard label="Peak Day" value={peakDay.r.toLocaleString()} sub={peakDay.date} accent={C.green} />
        <KpiCard label="Peak Hour" value={peakHour.r.toLocaleString()} sub={`15:00 UTC · 10 AM ET`} accent={C.amber} />
        <KpiCard label="Error Rate" value={`${errorRatePct}%`} sub={`${totalErrors.toLocaleString()} total errors`} accent={C.red} />
      </div>

      <div style={s.row2}>
        <div style={s.panel}>
          <PanelTitle badge="30d">Daily Traffic Volume</PanelTitle>
          <div style={{ position: "relative", height: 220 }}>
            <canvas ref={c1} />
          </div>
          {/* CHANGE 9: Spike explanation callout */}
          <div style={{ marginTop: 12 }}>
            <InsightBox color={C.amber} icon="⚑">
              <strong style={{ color: C.amber }}>Aug 29–31 spike (+62%):</strong> Pre-launch media coverage for
              Space Shuttle Endeavour mission STS-69 drove a surge from ~55K to 90K daily requests.
              Traffic peaked at 90,035 on Aug 31, two days before the scheduled launch window.
            </InsightBox>
          </div>
        </div>

        <div style={s.panel}>
          <PanelTitle>Error Distribution</PanelTitle>
          <div style={{ position: "relative", height: 160 }}>
            <canvas ref={c2} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {errorStatusSplit.map((item) => {
              // CHANGE 10: Show error % alongside count
              const pct = ((item.value / totalRequests) * 100).toFixed(3);
              return (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: C.muted }}>{item.name}</span>
                  <span style={{ fontFamily: MONO, fontWeight: 600 }}>{item.value.toLocaleString()}</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: C.hint, width: 46, textAlign: "right" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={s.panel}>
        {/* CHANGE 11: Title includes timezone context */}
        <PanelTitle badge="24h">Hourly Request Pattern · Peak 15:00 UTC (10 AM Eastern)</PanelTitle>
        <div style={{ position: "relative", height: 180 }}>
          <canvas ref={c3} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap", gap: 10 }}>
          <Legend items={[
            { color: C.amber,  label: "Peak" },
            { color: C.orange, label: "High (>80K)" },
            { color: C.blue,   label: "Medium (>60K)" },
            { color: C.border, label: "Low" },
          ]} />
          <div style={{ fontSize: 11, color: C.hint, fontStyle: "italic" }}>
            Hover bars for UTC + Eastern Time · Peak aligns with 10 AM US East Coast workday start
          </div>
        </div>
      </div>
    </div>
  );
}

function Traffic() {
  const c4 = useRef(null);
  const c5 = useRef(null);

  useEffect(() => {
    const charts = [];

    const spikePlugin = {
      id: "spikeAnnotation",
      afterDraw(chart) {
        const { ctx, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;
        const spikeX = xScale.getPixelForValue(27);
        ctx.save();
        ctx.strokeStyle = "rgba(210,153,34,0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(spikeX, yScale.top);
        ctx.lineTo(spikeX, yScale.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(210,153,34,0.85)";
        ctx.font = `500 9px ${MONO}`;
        ctx.textAlign = "left";
        ctx.fillText("STS-69 coverage", spikeX + 5, yScale.top + 14);
        ctx.restore();
      },
    };

    charts.push(new Chart(c4.current, {
      type: "line",
      plugins: [spikePlugin],
      data: {
        labels: dailyTraffic.map((d) => d.date),
        datasets: [{
          label: "Requests", data: dailyTraffic.map((d) => d.r),
          borderColor: C.blue, backgroundColor: "rgba(88,166,255,.08)",
          borderWidth: 1.5, pointRadius: 2, pointBackgroundColor: C.blue,
          tension: 0.35, fill: true,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { ...axTick, maxRotation: 45 }, grid: { color: "rgba(48,54,61,.3)" }, border: { display: false } },
          y: { ticks: { ...axTick, callback: (v) => fmt(v) }, grid: { color: gridColor }, border: { display: false } },
        },
      },
    }));

    charts.push(new Chart(c5.current, {
      type: "line",
      data: {
        labels: hourlyData.map((d) => `${d.h}:00`),
        datasets: [{
          label: "Requests", data: hourlyData.map((d) => d.r),
          borderColor: C.green, backgroundColor: "rgba(63,185,80,.07)",
          borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: true,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                const h = parseInt(items[0].label);
                const eastern = ((h - 5 + 24) % 24);
                const ampm = eastern >= 12 ? "PM" : "AM";
                const h12 = eastern % 12 || 12;
                return `${items[0].label} UTC  ·  ${h12}:00 ${ampm} Eastern`;
              },
            },
          },
        },
        scales: {
          x: { ticks: axTick, grid: { color: "rgba(48,54,61,.3)" }, border: { display: false } },
          y: { ticks: { ...axTick, callback: (v) => fmt(v) }, grid: { color: gridColor }, border: { display: false } },
        },
      },
    }));

    return () => charts.forEach((c) => c.destroy());
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={s.panel}>
        <PanelTitle badge={`${dailyTraffic.length} days`}>Daily Request Volume — August 1995</PanelTitle>
        <div style={{ position: "relative", height: 280 }}>
          <canvas ref={c4} />
        </div>
        <div style={{ marginTop: 12 }}>
          <InsightBox color={C.amber} icon="⚑">
            <strong style={{ color: C.amber }}>Spike Aug 29–31:</strong> Space Shuttle Endeavour (STS-69)
            pre-launch media coverage caused requests to jump from ~55K to 90K/day — a 62% increase.
            Weekend dips (~32–37K) are clearly visible throughout the month.
          </InsightBox>
        </div>
      </div>

      <div style={s.panel}>
        <PanelTitle>Hourly Breakdown — All times UTC (Eastern = UTC−5)</PanelTitle>
        <div style={{ position: "relative", height: 220 }}>
          <canvas ref={c5} />
        </div>
        <div style={{ fontSize: 11, color: C.hint, marginTop: 8, fontStyle: "italic" }}>
          Peak at 15:00 UTC = 10:00 AM Eastern. The daily request curve mirrors US East Coast government office hours. Hover for local time.
        </div>
      </div>

      <div style={s.kpiRow(4)}>
        <KpiCard label="Success Rate"         value={`${successRate}%`}         sub="of total requests"      accent={C.green}  highlight />
        <KpiCard label="Avg Weekday Traffic"  value={fmt(wdAvg)}               sub="Mon–Fri average"        accent={C.blue}   />
        <KpiCard label="Avg Weekend Traffic"  value={fmt(weAvg)}               sub="Sat–Sun average (−41%)" accent={C.amber}  />
        <KpiCard label="Overall Error Rate"   value={`${errorRatePct}%`}        sub={`${totalErrors} errors / ${fmt(totalRequests)} req`} accent={C.red} />
      </div>
    </div>
  );
}

function Errors() {
  const c6 = useRef(null);

  useEffect(() => {
    const chart = new Chart(c6.current, {
      type: "bar",
      indexAxis: "y",
      data: {
        labels: errorIPs.map((d) => d.ip),
        datasets: [{
          label: "Error Count",
          data: errorIPs.map((d) => d.e),
          backgroundColor: errorIPs.map((d) => (d.s === 403 ? C.red : C.amber)),
          borderRadius: 3, borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: axTick, grid: { color: gridColor }, border: { display: false } },
          y: { ticks: { ...axTick, font: { family: MONO, size: 9 } }, grid: { display: false }, border: { display: false } },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* CHANGE 12: Error KPIs now show rate % */}
      <div style={s.kpiRow(4)}>
        <KpiCard label="404 Not Found" value="2,847"            sub={`${notFoundRatePct}% of all requests`} accent={C.amber} />
        <KpiCard label="403 Forbidden" value="142"              sub="0.009% of all requests"               accent={C.red} />
        <KpiCard label="500/501 Errors" value="38"              sub="Server failures (0.002%)"             accent={C.purple} />
        <KpiCard label="Overall Error Rate" value={`${errorRatePct}%`} sub="Site health: excellent"       accent={C.green} highlight />
      </div>

      <InsightBox color={C.green} icon="✓">
        <strong style={{ color: C.green }}>Site health is excellent.</strong> At {errorRatePct}% error rate
        ({totalErrors.toLocaleString()} errors out of ~{fmt(totalRequests)} requests), this is well within
        normal operating range. The 404s are primarily from broken links to moved image assets — not server instability.
      </InsightBox>

      <div style={s.panel}>
        <PanelTitle badge={`${errorIPs.length} hosts`}>Top Error-Generating Hosts</PanelTitle>
        <div style={{ position: "relative", height: errorIPs.length * 42 + 60 }}>
          <canvas ref={c6} />
        </div>
      </div>

      <div style={{ ...s.panel, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
          {/* CHANGE 13: Added "Organization" column */}
          <PanelTitle>Error Log Details</PanelTitle>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              {["IP / Hostname", "Organization / ISP", "HTTP Status", "Error Count", "% of Errors", "Severity"].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {errorIPs.map((row, i) => {
              const pct = ((row.e / totalErrors) * 100).toFixed(1);
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)" }}>
                  <td style={s.monoTd}>{row.ip}</td>
                  <td style={{ ...s.td, color: C.muted }}>{row.org}</td>
                  <td style={s.td}><StatusBadge status={row.s} /></td>
                  <td style={{ ...s.monoTd, fontWeight: 600 }}>{row.e}</td>
                  <td style={{ ...s.monoTd, color: C.hint }}>{pct}%</td>
                  <td style={s.td}><SeverityBar count={row.e} status={row.s} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Resources() {
  const c7 = useRef(null);
  // CHANGE 14: Filter state for page vs asset
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? topRes : topRes.filter((d) => d.type === filter);
  const filteredTotal = filtered.reduce((s, d) => s + d.n, 0);

  useEffect(() => {
    const chart = new Chart(c7.current, {
      type: "bar",
      indexAxis: "y",
      data: {
        labels: topRes.map((d) => d.url.split("/").pop() || "/"),
        datasets: [{
          label: "Requests",
          data: topRes.map((d) => d.n),
          // CHANGE 15: Color bars by type (page = blue, asset = amber)
          backgroundColor: topRes.map((d) => d.type === "page" ? C.blue : C.amber),
          borderRadius: 3, borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { ...axTick, callback: (v) => fmt(v) }, grid: { color: gridColor }, border: { display: false } },
          y: { ticks: { ...axTick, font: { family: MONO, size: 9 } }, grid: { display: false }, border: { display: false } },
        },
      },
    });
    return () => chart.destroy();
  }, []);

  const pageHits  = topRes.filter(d => d.type === "page").reduce((s, d) => s + d.n, 0);
  const assetHits = topRes.filter(d => d.type === "asset").reduce((s, d) => s + d.n, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* CHANGE 16: Insight about asset inflation */}
      <InsightBox color={C.blue} icon="ℹ">
        <strong style={{ color: C.blue }}>Asset vs page requests:</strong> 8 of the top 10 resources are
        image assets (.gif files) that load automatically on every page — they inflate hit counts but
        don't represent user navigation. Only <strong style={{ color: C.text }}>/ksc.html</strong> and{" "}
        <strong style={{ color: C.text }}>/</strong> (homepage) represent actual page visits.
        Use the filter below to isolate page views.
      </InsightBox>

      <div style={s.panel}>
        <PanelTitle badge="Aug 1995">Top 10 Most Accessed Resources</PanelTitle>
        <Legend items={[
          { color: C.blue,  label: "HTML page (actual navigation)" },
          { color: C.amber, label: "Image asset (auto-loaded)" },
        ]} />
        <div style={{ position: "relative", height: topRes.length * 36 + 60, marginTop: 12 }}>
          <canvas ref={c7} />
        </div>
      </div>

      {/* CHANGE 17: Filter toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: C.muted, fontFamily: MONO }}>FILTER:</span>
        {["all", "page", "asset"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? (f === "page" ? "rgba(88,166,255,.15)" : f === "asset" ? "rgba(210,153,34,.15)" : "rgba(255,255,255,.08)") : "transparent",
              color: filter === f ? (f === "page" ? C.blue : f === "asset" ? C.amber : C.text) : C.muted,
              border: `1px solid ${filter === f ? (f === "page" ? C.blue : f === "asset" ? C.amber : C.border) : C.border}`,
              borderRadius: 5, padding: "4px 12px", fontFamily: MONO, fontSize: 10,
              cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em",
            }}
          >
            {f === "all" ? `All (${topRes.length})` : f === "page" ? `Pages (${topRes.filter(d=>d.type==="page").length})` : `Assets (${topRes.filter(d=>d.type==="asset").length})`}
          </button>
        ))}
        <span style={{ fontSize: 11, color: C.hint, marginLeft: 8 }}>
          Showing {filtered.length} resources · {fmt(filteredTotal)} total hits
        </span>
      </div>

      <div style={s.panel}>
        <PanelTitle>Resource Access Log</PanelTitle>
        {filtered.map((d, i) => {
          const pct = ((d.n / totalTopRes) * 100).toFixed(1);
          return (
            <div key={d.url} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "6px 0",
              borderBottom: i < filtered.length - 1 ? `1px solid rgba(48,54,61,.4)` : "none",
            }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.hint, width: 22, flexShrink: 0 }}>
                #{topRes.indexOf(d) + 1}
              </span>
              <TypePill type={d.type} />
              <span
                style={{ fontFamily: MONO, fontSize: 11, color: d.type === "page" ? C.blue : C.muted, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={d.url}
              >
                {d.url}
              </span>
              <div style={{ width: 80, flexShrink: 0, background: C.surface2, borderRadius: 3, height: 3, overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", borderRadius: 3, background: d.type === "page" ? C.blue : C.amber }} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, width: 56, textAlign: "right", flexShrink: 0 }}>
                {d.n.toLocaleString()}
              </span>
              <span style={{ fontSize: 10, color: C.hint, width: 34, textAlign: "right", flexShrink: 0 }}>{pct}%</span>
            </div>
          );
        })}
      </div>

      <div style={s.kpiRow(4)}>
        <KpiCard label="#1 Resource"    value="97,269"        sub="/images/nasa-logosmall.gif (asset)" accent={C.amber} />
        <KpiCard label="Page Views"     value={fmt(pageHits)} sub={`${topRes.filter(d=>d.type==="page").length} HTML pages in top 10`} accent={C.blue} />
        <KpiCard label="Asset Requests" value={fmt(assetHits)} sub={`${topRes.filter(d=>d.type==="asset").length} images — auto-loaded`} accent={C.muted} />
        <KpiCard label="Homepage Rank"  value="#10"           sub='"/" — 30,103 visits' accent={C.green} />
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

const TABS = ["overview", "traffic", "errors", "resources"];
const TAB_COMPONENTS = { overview: Overview, traffic: Traffic, errors: Errors, resources: Resources };

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const TabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }
        button { cursor: pointer; transition: background .15s, color .15s; }
        button:hover { opacity: 0.85; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .live-dot { animation: blink 2s infinite; }
        @media (max-width: 900px) {
          .row2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <header style={s.header}>
        <div style={s.logo}>
          <LogoIcon />
          LogAnalyzer
        </div>
        <div style={s.liveBadge}>
          <div className="live-dot" style={s.liveDot} />
          NASA KSC · AUG 1995
        </div>
        <nav style={s.nav}>
          {TABS.map((tab) => (
            <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </TabButton>
          ))}
        </nav>
      </header>

      <main style={s.main}>
        <TabComponent key={activeTab} />
      </main>
    </div>
  );
}
