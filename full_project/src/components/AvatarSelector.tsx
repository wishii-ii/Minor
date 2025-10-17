import React from 'react';

interface AvatarSelectorProps {
  value: string;
  onChange: (avatar: string) => void;
}

const AVATARS = [
  '🧙‍♂️', '🧝‍♀️', '🧛‍♂️', '🧚‍♀️', '🧞‍♂️', '🧜‍♀️', '🦸‍♂️', '🦹‍♀️', '🐉', '🦄'
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {AVATARS.map((a) => (
        <button
          key={a}
          onClick={() => onChange(a)}
          className={`p-3 rounded-lg text-2xl flex items-center justify-center border-2 transition-all ${value === a ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:border-gray-200'}`}>
          {a}
        </button>
      ))}
    </div>
  );
};
