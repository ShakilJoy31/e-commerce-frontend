export default function StatCard({
  value,
  label,
  icon,
  percentage,
  isPositive,
}) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
      {/* Left: Icon */}
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600`}
      >
        {icon}
      </div>

      {/* Right: Content */}
      <div className="ml-4">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-gray-500">{label}</p>
        <div
          className={`flex items-center mt-2 text-sm ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentage}
          <span className="ml-1">{isPositive ? "↑" : "↓"}</span>
        </div>
      </div>
    </div>
  );
}
