import React, { useEffect, useState } from 'react';
import { FaFlag, FaUsers, FaClock, FaLock } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { BaseLayout } from '../components/BaseLayout';

const Quests: React.FC = () => {
  const { user } = useUser();
  const [availableQuests, setAvailableQuests] = useState<any[]>([]);
  
  const userLevel = user?.level ?? 0;
  const xpToLevel5 = user ? Math.max(0, (5 * 500) - (user.xp + (user.level - 1) * 500)) : 5 * 500;

  const appId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'default-app-id';

  useEffect(() => {
    if (!db) return;
    
    const questsRef = collection(db, `artifacts/${appId}/public/data/quests`);

    const unsubscribe = onSnapshot(questsRef, (snapshot) => {
      const quests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched quests:", quests);
      setAvailableQuests(quests); 
    }, (error) => {
      console.error("Error fetching quests:", error);
    });
    
    return () => unsubscribe();
  }, [appId]);

  return (
    <BaseLayout className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quests</h1>
        <p className="text-gray-600 dark:text-gray-300">Join your party on epic adventures — every completed habit chips away at the boss.</p>
      </div>

      {userLevel < 5 ? (
        <div className="mb-8 rounded-xl border border-indigo-100 dark:border-indigo-900/30 p-6 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Quests are locked</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Reach level 5 to unlock cooperative quests and boss battles.</p>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
              style={{ width: `${Math.min(100, ((user?.level ?? 0) / 5) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">Level: <span className="font-semibold">{userLevel}</span></div>
            <div className="text-sm text-gray-700 dark:text-gray-300">XP needed to reach level 5: <span className="font-semibold">{xpToLevel5}</span></div>
            <button
              disabled
              className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-400 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-800"
            >
              Locked
            </button>
          </div>
        </div>
      ) : null}

      {/* Available Quests (Dynamically Loaded) */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Available Quests</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuests.length > 0 ? (
            availableQuests.map(quest => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                difficulty={['easy', 'medium', 'hard'].includes(quest.difficulty) ? quest.difficulty : 'easy'}
                participants={quest.participants || 0}
                duration={quest.duration}
                rewards={quest.rewards || []}
                locked={userLevel < 5}
              />
            ))
          ) : (
            <div className="lg:col-span-3 text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <FaFlag className="text-4xl mx-auto mb-3 text-indigo-300 dark:text-indigo-600" />
              <p>No quests are currently available.</p>
              <p className='text-sm mt-1'>Start a new one in the creation section below!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quest Creation */}
      <div className="mt-6">
        {userLevel < 5 ? (
          <div className="relative rounded-xl p-6 border border-dashed border-indigo-100 dark:border-indigo-900/30 bg-white/80 dark:bg-gray-800/80">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                <FaLock />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Create Your Own Quest</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Custom quests are available once you reach level 5.</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">Reach level 5 to unlock custom quest creation.</div>
              <button disabled className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-600 cursor-not-allowed">Locked</button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-500/30">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Create Your Own Quest</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Lead your friends on a custom adventure tailored to your shared goals
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
              Start Quest Creation
            </button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

// --- QuestCard Component ---
const QuestCard: React.FC<{
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  duration: string;
  rewards: string[];
  locked?: boolean;
}> = ({ title, description, difficulty, participants, duration, rewards, locked = false }) => {
  const difficultyColors = {
    easy: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    hard: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-indigo-900/30 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <FaFlag className="text-indigo-500" />
        <h3 className="font-bold text-gray-800 dark:text-white">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FaUsers className="text-purple-400" />
          <span>{participants} adventurers joined</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FaClock className="text-purple-400" />
          <span>{duration} to complete</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rewards:</h4>
        <div className="space-y-1">
          {rewards.map((reward, index) => (
            <span key={index} className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full mr-1">
              {reward}
            </span>
          ))}
        </div>
      </div>

      <button
        disabled={locked}
        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
          locked
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-100 dark:border-gray-600'
            : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
        }`}
      >
        {locked ? 'Locked (Reach level 5)' : 'Join Quest'}
      </button>
    </div>
  );
};

export default Quests;