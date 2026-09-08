import React, { useState, useId } from "react";
import { FiTrendingUp, FiCalendar } from "react-icons/fi";

export function SearchesPerDayChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [range, setRange] = useState("14d"); // "7d" | "14d"
  const chartGradientId = useId();

  const filteredData = range === "7d" ? data.slice(-7) : data;

  // Chart Dimensions & Scales
  const width = 680;
  const height = 240;
  const padding = { top: 20, right: 25, bottom: 35, left: 45 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...filteredData.map((d) => d.searches), 1000);
  const yMax = Math.ceil((maxVal * 1.15) / 1000) * 1000;

  const getX = (index) => padding.left + (index / (filteredData.length - 1)) * innerWidth;
  const getY = (val) => padding.top + innerHeight - (val / yMax) * innerHeight;

  // Construct SVG Path using smooth cubic bezier curves
  const points = filteredData.map((d, i) => ({ x: getX(i), y: getY(d.searches), ...d }));

  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i != points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
  }

  const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} ${padding.top + innerHeight} L ${points[0]?.x || 0} ${padding.top + innerHeight} Z`;

  // Horizontal Gridlines
  const yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Searches Per Day</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
              <FiTrendingUp className="text-xs" /> +18.6%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily search volume and automation activity</p>
        </div>

        {/* Range Toggle */}
        <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs font-medium text-slate-600 dark:text-slate-400 self-start sm:self-auto">
          <button
            onClick={() => setRange("7d")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              range === "7d" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange("14d")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              range === "14d" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Last 14 Days
          </button>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative mt-4 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] overflow-visible select-none"
        >
          <defs>
            <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((val, i) => {
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? "none" : "3,3"}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-sans"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Gradient Area */}
          <path d={areaD} fill={`url(#${chartGradientId})`} />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points & X-Axis Labels */}
          {points.map((p, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                {/* X Axis Label */}
                <text
                  x={p.x}
                  y={height - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered ? "fill-indigo-600 font-semibold" : "fill-slate-400"
                  }`}
                >
                  {p.date}
                </text>

                {/* Point dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? "#4f46e5" : "#ffffff"}
                  stroke="#4f46e5"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Interactive vertical touch target */}
                <rect
                  x={p.x - 15}
                  y={padding.top}
                  width={30}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded-lg p-2.5 shadow-xl text-xs flex flex-col gap-1 -translate-x-1/2 -translate-y-full transition-all duration-75 border border-slate-700"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 8}%`
            }}
          >
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-700 pb-1">
              <FiCalendar className="text-indigo-400 text-xs" />
              {points[hoveredIndex].date}
            </div>
            <div className="flex justify-between gap-3 text-slate-300 pt-0.5">
              <span>Total Searches:</span>
              <span className="font-bold text-white">
                {points[hoveredIndex].searches.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-emerald-400 text-[11px]">
              <span>Successful:</span>
              <span>{points[hoveredIndex].successful.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-3 text-rose-400 text-[11px]">
              <span>Failed:</span>
              <span>{points[hoveredIndex].failed.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Total Searches</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Avg. Success (96.3%)</span>
          </div>
        </div>
        <span className="hidden sm:inline text-slate-400">Real-time telemetry</span>
      </div>
    </div>
  );
}

export default SearchesPerDayChart;
