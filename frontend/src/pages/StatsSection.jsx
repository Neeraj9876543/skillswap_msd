import React from "react";
import { CountUp } from "./CountUp";
const stats = [
  { icon: "👥", value: 2500, suffix: "+", label: "Active Members", colorScheme: "primary" },
  { icon: "📚", value: 150, suffix: "+", label: "Skills Available", colorScheme: "secondary" },
  { icon: "✅", value: 10000, suffix: "+", label: "Sessions Completed", colorScheme: "default" },
];
function StatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md"
        >
          <div className="text-4xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-gray-800">
            <CountUp
              value={stat.value}
              suffix={stat.suffix}
              duration={2}
              colorScheme={stat.colorScheme}
            />
          </div>
          <p className="text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
export default StatsSection;
