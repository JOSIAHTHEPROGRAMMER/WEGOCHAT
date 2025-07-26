import React from 'react';

const StatusDot = ({ status = "offline", className = "" }) => {
  const colorMap = {
    online: 'bg-green-400',
    afk: 'bg-red-500',
    invisible: 'bg-gray-400',
    offline: 'bg-zinc-500',
  };

  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${colorMap[status] || 'bg-zinc-500'} ${className}`}
    />
  );
};

export default StatusDot;
