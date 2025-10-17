
import React, { useState } from 'react';
import { FaCoins, FaUser, FaGift, FaPalette } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';


export const Rewards: React.FC = () => {
  type CategoryKey = 'avatars' | 'treats' | 'themes';
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('avatars');
  const { user, spendCoins, signIn, addPurchaseId } = useUser();

  // Use user's coins only when signed in; otherwise require sign-in
  const userCoins = user ? (user.coins ?? 0) : null;

  // Local ownership state; initialize from persisted user purchases when available
  const [ownedIds, setOwnedIds] = useState<number[]>([1, 8]);
  const [notice, setNotice] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  React.useEffect(() => {
    if (!user) return;
    const persisted = user.purchasedRewardIds ?? [];
    // merge defaults with persisted purchases
    setOwnedIds(prev => Array.from(new Set([...prev, ...persisted])));
  }, [user]);

  const rewards = {
    avatars: [
      { id: 1, name: 'Wizard Robes', price: 100, owned: ownedIds.includes(1), icon: '🧙‍♂️', rarity: 'common' as const, description: 'A classic wizard outfit to show your mastery.' },
      { id: 2, name: 'Knight Armor', price: 200, owned: ownedIds.includes(2), icon: '⚔️', rarity: 'rare' as const, description: 'Tough and noble armor to show your resolve.' },
      { id: 3, name: 'Dragon Wings', price: 500, owned: ownedIds.includes(3), icon: '🐉', rarity: 'legendary' as const, description: 'Soar above your goals with dragon wings.' },
      { id: 4, name: 'Phoenix Feathers', price: 300, owned: ownedIds.includes(4), icon: '🔥', rarity: 'epic' as const, description: 'Rise from the ashes and claim your victory.' },
    ],
    treats: [
      { id: 5, name: 'Coffee Break', price: 50, owned: ownedIds.includes(5), icon: '☕', rarity: 'common' as const, description: 'Treat yourself to your favorite coffee' },
      { id: 6, name: 'Movie Night', price: 150, owned: ownedIds.includes(6), icon: '🎬', rarity: 'rare' as const, description: 'Enjoy a relaxing movie evening' },
      { id: 7, name: 'Spa Day', price: 400, owned: ownedIds.includes(7), icon: '🧘‍♀️', rarity: 'legendary' as const, description: 'A full day of self-care and relaxation' },
    ],
    themes: [
      { id: 8, name: 'Dark Mode', price: 75, owned: ownedIds.includes(8), icon: '🌙', rarity: 'common' as const, description: 'A comfortable dark theme for late-night work.' },
      { id: 9, name: 'Forest Theme', price: 125, owned: ownedIds.includes(9), icon: '🌲', rarity: 'rare' as const, description: 'Bring calm and focus with a nature-themed UI.' },
      { id: 10, name: 'Galaxy Theme', price: 250, owned: ownedIds.includes(10), icon: '✨', rarity: 'epic' as const, description: 'A starry background to inspire big goals.' },
    ]
  };

  const rarityColors = {
    common: 'border-gray-300 bg-gray-50',
    rare: 'border-blue-300 bg-blue-50',
    epic: 'border-purple-300 bg-purple-50',
    legendary: 'border-yellow-300 bg-yellow-50'
  };

  const handlePurchase = async (rewardId: number, price: number, rewardName: string) => {
    if (!user) {
      setNotice('Sign in to purchase rewards.');
      setTimeout(() => setNotice(null), 2500);
      return;
    }

    if (ownedIds.includes(rewardId)) {
      setNotice('You already own this item.');
      setTimeout(() => setNotice(null), 2500);
      return;
    }

    if ((user.coins ?? 0) < price) {
      setNotice('Not enough coins. Try completing more habits or quests to earn coins.');
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    setLoadingId(rewardId);
    const success = await spendCoins(price);
    setLoadingId(null);

    if (success) {
      setOwnedIds(prev => Array.from(new Set([...prev, rewardId])));
      // persist the purchase to the user's profile so Settings can show owned items
      try {
        await addPurchaseId(rewardId);
      } catch (err) {
        // ignore persistence failures locally but keep the UI updated
        console.warn('Failed to persist purchase id:', err);
      }
      setNotice(`Purchased ${rewardName}! Check your profile/settings to equip.`);
    } else {
      setNotice('Purchase failed. Please try again.');
    }

    setTimeout(() => setNotice(null), 3500);
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
            <span className="font-semibold">{user ? `${userCoins} Coins` : 'Sign in to see coins'}</span>
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
            canAfford={user ? (user.coins ?? 0) >= reward.price : false}
            rarityStyle={rarityColors[reward.rarity as keyof typeof rarityColors]}
            onPurchase={() => handlePurchase(reward.id, reward.price, reward.name)}
            loading={loadingId === reward.id}
            requireSignIn={!user}
            onSignIn={() => signIn()}
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
      {notice && (
        <div className="mt-6 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md max-w-md">{notice}</div>
      )}
    </div>
  );
};

type Reward = { id: number; name: string; price: number; owned?: boolean; icon?: string; rarity: 'common' | 'rare' | 'epic' | 'legendary'; description?: string };

const RewardCard: React.FC<{
  reward: Reward;
  canAfford: boolean;
  rarityStyle: string;
  onPurchase?: () => void;
  loading?: boolean;
  requireSignIn?: boolean;
  onSignIn?: () => void;
}> = ({ reward, canAfford, rarityStyle, onPurchase, loading, requireSignIn, onSignIn }) => {
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

      {requireSignIn ? (
        <div className="flex flex-col gap-2">
          <button onClick={() => onSignIn && onSignIn()} className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium">Sign in to purchase</button>
          <div className="text-xs text-gray-500 text-center">You must be signed in to spend coins.</div>
        </div>
      ) : (
        <button
          onClick={() => onPurchase && onPurchase()}
          disabled={reward.owned || !canAfford || loading}
          className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${reward.owned
            ? 'bg-green-100 text-green-700 cursor-default'
            : canAfford
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? 'Processing...' : reward.owned ? 'Owned' : canAfford ? 'Purchase' : 'Insufficient Coins'}
        </button>
      )}
    </div>
  );
};