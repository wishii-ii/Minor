import React, { useEffect, useState } from 'react';
import { FaFlag, FaUsers, FaClock, FaLock } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase'; // Import db
import { collection, onSnapshot } from 'firebase/firestore'; // Import Firestore helpers

// The environment variables in .env.local are accessible via import.meta.env

// FIX: Removed 'export' keyword from the component definition. 
// It will now be exported as the default export at the end of the file.
const Quests: React.FC = () => {
  const { user } = useUser();
  const [availableQuests, setAvailableQuests] = useState<any[]>([]);
  
  const userLevel = user?.level ?? 0;
  // Calculate XP needed to reach level 5. Assuming 500 XP per level after level 1.
  const xpToLevel5 = user ? Math.max(0, (5 * 500) - (user.xp + (user.level - 1) * 500)) : 5 * 500;

  // Retrieve the app identifier from the environment variables (VITE_FIREBASE_PROJECT_ID is a stable unique ID)
  // We use the project ID as the secure app ID for Firestore pathing.
  const appId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'default-app-id';

  // --- Firestore Data Fetching for Quests ---
  useEffect(() => {
    if (!db) return;
    
    // Quests are public data, accessible by all users of this app.
    // Path: /artifacts/{appId}/public/data/quests
    const questsRef = collection(db, `artifacts/${appId}/public/data/quests`);

    // Listen for real-time updates to the quests collection
    const unsubscribe = onSnapshot(questsRef, (snapshot) => {
      const quests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Check if the quest is still 'active' or 'available' if you add status fields later.
        // For now, we assume all documents in this collection are available quests.
      }));
      console.log("Fetched quests:", quests);
      // Since the user asked to remove hardcoded quests and show actual quests, we use the fetched data.
      setAvailableQuests(quests); 
    }, (error) => {
      console.error("Error fetching quests:", error);
    });
    
    return () => unsubscribe();
  }, [appId]);

  // --- Component Rendering ---
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quests</h1>
        <p className="text-gray-600">Join your party on epic adventures — every completed habit chips away at the boss.</p>
      </div>

      {userLevel < 5 ? (
        <div className="mb-8 rounded-xl border border-indigo-100 p-6 bg-gradient-to-r from-indigo-50 to-white">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Quests are locked</h2>
          <p className="text-gray-600 mb-4">Reach level 5 to unlock cooperative quests and boss battles.</p>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
              style={{ width: `${Math.min(100, ((user?.level ?? 0) / 5) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-700">Level: <span className="font-semibold">{userLevel}</span></div>
            <div className="text-sm text-gray-700">XP needed to reach level 5: <span className="font-semibold">{xpToLevel5}</span></div>
            <button
              disabled
              className="px-4 py-2 bg-indigo-100 text-indigo-400 rounded-lg border border-indigo-100"
            >
              Locked
            </button>
          </div>
        </div>
      ) : null}

      {/* Available Quests (Dynamically Loaded) */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Quests</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuests.length > 0 ? (
            availableQuests.map(quest => (
              <QuestCard
                key={quest.id}
                title={quest.title}
                description={quest.description}
                // Ensure the difficulty is one of the allowed strings or default to 'easy'
                difficulty={['easy', 'medium', 'hard'].includes(quest.difficulty) ? quest.difficulty : 'easy'}
                participants={quest.participants || 0}
                duration={quest.duration}
                rewards={quest.rewards || []}
                locked={userLevel < 5} // Quests remain locked until user reaches level 5
              />
            ))
          ) : (
            <div className="lg:col-span-3 text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <FaFlag className="text-4xl mx-auto mb-3 text-indigo-300" />
              <p>No quests are currently available.</p>
              <p className='text-sm mt-1'>Start a new one in the creation section below!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quest Creation */}
      <div className="mt-6">
        {userLevel < 5 ? (
          <div className="relative rounded-xl p-6 border border-dashed border-indigo-100 bg-white/80">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                <FaLock />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Create Your Own Quest</h3>
                <p className="text-sm text-gray-600">Custom quests are available once you reach level 5.</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">Reach level 5 to unlock custom quest creation.</div>
              <button disabled className="px-4 py-2 rounded-lg bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed">Locked</button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Create Your Own Quest</h3>
            <p className="text-gray-600 mb-4">
              Lead your friends on a custom adventure tailored to your shared goals
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
              Start Quest Creation
            </button>
          </div>
        )}
      </div>
    </div>
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
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <FaFlag className="text-indigo-500" />
        <h3 className="font-bold text-gray-800">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaUsers className="text-purple-400" />
          <span>{participants} adventurers joined</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaClock className="text-purple-400" />
          <span>{duration} to complete</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Rewards:</h4>
        <div className="space-y-1">
          {rewards.map((reward, index) => (
            <span key={index} className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full mr-1">
              {reward}
            </span>
          ))}
        </div>
      </div>

      <button
        disabled={locked}
        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${locked
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
          : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
          }`}
      >
        {locked ? 'Locked (Reach level 5)' : 'Join Quest'}
      </button>
    </div>
  );
};

export default Quests;