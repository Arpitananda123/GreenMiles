import CircularProgress from './CircularProgress';

interface ChargingStationProps {
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  percentage: number;
  available: boolean;
}

export default function ChargingStation({ position, percentage, available }: ChargingStationProps) {
  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 75) return "#16A34A"; // Green
    if (percentage >= 40) return "#F59E0B"; // Amber
    return "#9CA3AF"; // Gray
  };

  return (
    <div className="absolute charging-station" style={position}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-full p-2 shadow-md">
          <div className="h-8 w-8 relative">
            <CircularProgress 
              percentage={percentage} 
              color={getColor()} 
            />
          </div>
        </div>
      </div>
      <div 
        className={`absolute -bottom-1 -right-1 h-5 w-5 ${available ? 'bg-[#0ea5e9]' : 'bg-red-500'} rounded-full flex items-center justify-center shadow-md`}
      >
        {available ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  );
}
