
import React, { useState } from 'react';
import { FaCoins, FaUser, FaGift, FaPalette } from 'react-icons/fa';


export const Rewards: React.FC = () => {
  type CategoryKey = 'avatars' | 'treats' | 'themes';
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('avatars');

  // Mock currency system - could be XP points or separate reward points
  const rewardPoints = 450;

  const rewards = {
    avatars: [
      { id: 1, name: 'Wizard Robes', price: 100, owned: true, icon: '🧙‍♂️', rarity: 'common' as const },
      { id: 2, name: 'Knight Armor', price: 200, owned: false, icon: '⚔️', rarity: 'rare' as const },
      { id: 3, name: 'Dragon Wings', price: 500, owned: false, icon: '🐉', rarity: 'legendary' as const },
      { id: 4, name: 'Phoenix Feathers', price: 300, owned: false, icon: '🔥', rarity: 'epic' as const },
    ],
    treats: [
      { id: 5, name: 'Coffee Break', price: 50, owned: false, icon: '☕', rarity: 'common' as const, description: 'Treat yourself to your favorite coffee' },
      { id: 6, name: 'Movie Night', price: 150, owned: false, icon: '🎬', rarity: 'rare' as const, description: 'Enjoy a relaxing movie evening' },
      { id: 7, name: 'Spa Day', price: 400, owned: false, icon: '🧘‍♀️', rarity: 'legendary' as const, description: 'A full day of self-care and relaxation' },
    ],
    themes: [
      { id: 8, name: 'Dark Mode', price: 75, owned: true, icon: '🌙', rarity: 'common' as const },
      { id: 9, name: 'Forest Theme', price: 125, owned: false, icon: '🌲', rarity: 'rare' as const },
      { id: 10, name: 'Galaxy Theme', price: 250, owned: false, icon: '✨', rarity: 'epic' as const },
    ]
  };

  const rarityColors = {
    common: 'border-gray-300 bg-gray-50',
    rare: 'border-blue-300 bg-blue-50',
    epic: 'border-purple-300 bg-purple-50',
    legendary: 'border-yellow-300 bg-yellow-50'
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rewards Shop</h1>
          <p className="text-gray-600">Exchange your progress for amazing rewards</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl">
          <div className="flex items-center gap-2">
            <FaCoins />
            <span className="font-semibold">{rewardPoints} Points</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-4 mb-8">
        {([
          { key: 'avatars' as CategoryKey, label: 'Avatars', icon: <FaUser /> },
            { key: 'treats' as CategoryKey, label: 'Real-Life Treats', icon: <FaGift /> },
            { key: 'themes' as CategoryKey, label: 'Themes', icon: <FaPalette /> }
        ] as const).map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${selectedCategory === category.key
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rewards[selectedCategory].map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            canAfford={rewardPoints >= reward.price}
            rarityStyle={rarityColors[reward.rarity as keyof typeof rarityColors]}
          />
        ))}
      </div>

      {/* Earning Tips */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">💡 How to Earn More Points</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>• Complete daily habits (+10-20 points each)</p>
            <p>• Maintain streaks (+5 bonus per day)</p>
            <p>• Participate in quests (+50-100 points)</p>
          </div>
          <div>
            <p>• Achieve milestones (+25-200 points)</p>
            <p>• Help team members (+10 points)</p>
            <p>• Weekly consistency bonus (+50 points)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

type Reward = { id: number; name: string; price: number; owned?: boolean; icon?: string; rarity: 'common' | 'rare' | 'epic' | 'legendary'; description?: string };

const RewardCard: React.FC<{
  reward: Reward;
  // userPoints: number;
  canAfford: boolean;
  rarityStyle: string;
}> = ({ reward, canAfford, rarityStyle }) => {
  return (
    <div className={`rounded-xl p-4 border-2 shadow-md hover:shadow-lg transition-all duration-200 ${rarityStyle}`}>
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{reward.icon}</div>
        <h3 className="font-bold text-gray-800">{reward.name}</h3>
        {reward.description && (
          <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <FaCoins className="text-yellow-500" />
          <span className="font-semibold text-gray-800">{reward.price}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${reward.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
          reward.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
            reward.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
              'bg-yellow-200 text-yellow-700'
          }`}>
          {reward.rarity}
        </span>
      </div>

      <button
        disabled={reward.owned || !canAfford}
        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${reward.owned
          ? 'bg-green-100 text-green-700 cursor-default'
          : canAfford
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
      >
        {reward.owned ? 'Owned' : canAfford ? 'Purchase' : 'Insufficient Points'}
      </button>
    </div>
  );
};