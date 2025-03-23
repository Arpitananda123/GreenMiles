interface CircularProgressProps {
  percentage: number;
  color: string;
}

export default function CircularProgress({ percentage, color }: CircularProgressProps) {
  // Calculate the stroke-dasharray value
  const circumference = 2 * Math.PI * 15.9155; // From the viewBox and radius
  const dashArray = (percentage / 100) * circumference;
  
  return (
    <svg viewBox="0 0 36 36" className="w-full h-full">
      <path 
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
        fill="none" 
        stroke="#E2E8F0" 
        strokeWidth="3" 
      />
      <path 
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
        fill="none" 
        stroke={color} 
        strokeWidth="3" 
        strokeDasharray={`${dashArray}, ${circumference}`} 
      />
      <text x="18" y="20.5" textAnchor="middle" className="text-xs font-semibold">{percentage}%</text>
    </svg>
  );
}
