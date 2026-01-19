import React from 'react';

interface RuleCardProps {
  title: string;
  children: React.ReactNode;
}

const RuleCard = ( {title, children }: RuleCardProps ) => {
  return (
    <div className="bg-gray-900/75 backdrop-blur-md rounded-2xl p-7 shadow-2xl ring-1 ring-white/15">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="text-gray-300 space-y-3">{children}</div>
    </div>
  )
}

export default RuleCard;
