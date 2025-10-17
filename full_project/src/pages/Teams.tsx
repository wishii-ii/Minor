// Add a type definition for the global environment variable __app_id
declare const __app_id: string;

import React, { useEffect, useState } from 'react';
import { FaCrown, FaUser, FaLock, FaUsers } from 'react-icons/fa'; // Replaced FaGlobe with FaUsers
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, doc } from 'firebase/firestore'; // Removed 'where' import

// Define the Team interface for type safety
interface TeamData {
  id: string;
  name: string;
  members: string[]; // Array of User IDs (UIDs)
  leaderId: string;
  activeQuests: number;
  teamXP: number;
  avatar: string; // Emoji character
}

// --- Create Team Modal Component ---
const CreateTeamModal: React.FC<{ 
  onClose: () => void; 
  onCreate: (name: string, avatar: string) => void;
}> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('⚔️');
  const [error, setError] = useState('');

  const emojis = ['⚔️', '🛡️', '🐉', '🔮', '✨', '🐺', '🦉', '💰', '🔥', '🌊'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('Team name must be at least 3 characters.');
      return;
    }
    setError('');
    onCreate(name.trim(), avatar);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Team</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Avatar</label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {emojis.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setAvatar(e)}
                  className={`text-2xl p-2 rounded-full transition-all duration-150 ${avatar === e ? 'ring-4 ring-indigo-500 bg-indigo-100' : 'hover:bg-gray-200'}`}
                  aria-label={`Select ${e} as team avatar`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
            <input
              id="teamName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Code Crusaders"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={name.trim().length < 3}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${name.trim().length < 3
                ? 'bg-indigo-300 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md'
              }`}
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export const Teams: React.FC = () => {
  const { user } = useUser();
  const [allTeams, setAllTeams] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false); // New state for modal

  // Get user info
  const userId = user?.id;
  const userLevel = user?.level ?? 0;
  const isLocked = userLevel < 5;

  // Use the global __app_id variable provided by the environment
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


  // --- Firebase Write Operations ---

  const handleCreateTeam = async (name: string, avatar: string) => {
    if (!userId || !db) return;

    try {
      const teamsCollectionRef = collection(db, `artifacts/${appId}/public/data/teams`);
      
      const newTeam: Omit<TeamData, 'id'> = {
        name,
        members: [userId],
        leaderId: userId,
        activeQuests: 0,
        teamXP: 0,
        avatar,
      };

      await addDoc(teamsCollectionRef, newTeam);
      setShowCreateModal(false);
      console.log('Team created successfully!');
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!userId || !db) return;

    try {
      const teamDocRef = doc(db, `artifacts/${appId}/public/data/teams`, teamId);
      
      // Find the current members list to update it safely.
      const teamToUpdate = allTeams.find(t => t.id === teamId);
      if (!teamToUpdate) {
        console.error("Team not found for joining.");
        return;
      }
      
      // Prevent duplicate members just in case
      if (teamToUpdate.members.includes(userId)) return;

      const newMembers = [...teamToUpdate.members, userId];

      // Update the document in Firestore
      await updateDoc(teamDocRef, { members: newMembers });
      console.log(`Joined team ${teamId} successfully!`);
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };


  // --- Firestore Data Fetching for Teams ---
  useEffect(() => {
    if (!db) return;

    // Teams are public data, accessible by all users of this app.
    // Path: /artifacts/{appId}/public/data/teams
    const teamsRef = collection(db, `artifacts/${appId}/public/data/teams`);
    
    // We can use a simple query to fetch all public teams
    const q = query(teamsRef);

    console.log("Subscribing to public teams collection...");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teams = snapshot.docs.map(doc => ({
        id: doc.id,
        // Ensure default values are provided for fields that might be missing
        name: doc.data().name || 'Unnamed Team',
        members: doc.data().members || [],
        leaderId: doc.data().leaderId || '',
        activeQuests: doc.data().activeQuests || 0,
        teamXP: doc.data().teamXP || 0,
        avatar: doc.data().avatar || '❓',
      })) as TeamData[];
      
      setAllTeams(teams);
      setIsLoading(false);
      console.log(`Fetched ${teams.length} teams.`);
    }, (error) => {
      console.error("Error fetching teams:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [appId]);


  // --- Filtering Logic (Client-side) ---
  const myTeams = allTeams.filter(team => team.members.includes(userId || ''));
  const discoverTeams = allTeams.filter(team => !team.members.includes(userId || ''));

  const renderTeamCard = (team: TeamData, isMember: boolean) => {
    // Determine role based on the corrected 'userId' (which is user.id)
    const role = isMember ? (team.leaderId === userId ? 'leader' : 'member') : 'none';
    const canJoin = !isMember && !isLocked; // Can join if not a member and not locked

    return (
      <TeamCard
        key={team.id}
        teamId={team.id}
        name={team.name}
        members={team.members.length}
        role={role as 'leader' | 'member' | 'none'}
        activeQuests={team.activeQuests}
        teamXP={team.teamXP}
        avatar={team.avatar}
        canJoin={canJoin}
        locked={isLocked}
        onJoin={handleJoinTeam} // Pass join handler
      />
    );
  };


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teams</h1>
          <p className="text-gray-600">Connect with friends and stay accountable together</p>
        </div>

        <div>
          <button
            onClick={() => setShowCreateModal(true)} // Open modal on click
            disabled={isLocked}
            aria-disabled={isLocked}
            title={isLocked ? "Teams are locked until you reach level 5" : "Create a New Team"}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 ${isLocked
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
              }`}
          >
            <FaLock className={isLocked ? 'block' : 'hidden'} />
            Create Team {isLocked ? '(Locked)' : ''}
          </button>
        </div>
      </div>

      {/* Team Creation Modal */}
      {showCreateModal && <CreateTeamModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateTeam} />}

      {/* Locked banner */}
      {isLocked && (
        <div className="mb-8 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 shadow-sm">
          <div className="flex items-center gap-3">
            <FaLock className="text-yellow-600" />
            <div>
              <strong>Teams are locked</strong>
              <div className="text-sm">Reach level 5 to unlock full Teams functionality (create, join, and manage teams).</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
         <div className="text-center py-12 text-gray-500">
            <svg className="animate-spin h-6 w-6 mr-3 inline text-indigo-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Fetching teams...
         </div>
      )}

      {!isLoading && (
        <>
          {/* My Teams */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Teams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeams.length > 0 ? (
                myTeams.map(team => renderTeamCard(team, true))
              ) : (
                <div className="lg:col-span-3 text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <FaUser className="text-4xl mx-auto mb-3 text-indigo-300" />
                  <p>You haven't joined any teams yet.</p>
                  <p className='text-sm mt-1'>Explore the teams below to start collaborating!</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Teams */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Discover Teams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverTeams.length > 0 ? (
                discoverTeams.map(team => renderTeamCard(team, false))
              ) : (
                <div className="lg:col-span-3 text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <FaUsers className="text-4xl mx-auto mb-3 text-indigo-300" /> {/* Changed from FaGlobe */}
                  <p>No other teams are currently available to join.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// TeamCard component updated to accept onJoin handler and teamId
const TeamCard: React.FC<{
  teamId: string; // New: required for joining
  name: string;
  members: number;
  role: 'leader' | 'member' | 'none';
  activeQuests: number;
  teamXP: number;
  avatar: string;
  canJoin?: boolean;
  locked?: boolean;
  onJoin: (teamId: string) => void; // New: handler for joining
}> = ({ name, members, role, activeQuests, teamXP, avatar, canJoin, locked = false, onJoin, teamId }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
          {avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{name}</h3>
            {role === 'leader' && <FaCrown className="text-yellow-500" />}
          </div>
          <p className="text-sm text-gray-600">{members} members</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Active Quests</span>
          <span className="font-medium text-gray-800">{activeQuests}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Team XP</span>
          <span className="font-medium text-purple-600">{teamXP.toLocaleString()}</span>
        </div>
      </div>

      {role !== 'none' && (
        <div className="flex items-center gap-2 mb-4">
          {role === 'leader' ? <FaCrown className="text-yellow-500" /> : <FaUser className="text-purple-400" />}
          <span className="text-sm font-medium text-gray-700">
            {role === 'leader' ? 'Team Leader' : 'Member'}
          </span>
        </div>
      )}

      <button
        onClick={canJoin ? () => onJoin(teamId) : undefined} // New onClick handler for joining
        disabled={locked || (canJoin === false && role === 'none')} // Disable if locked OR if not a member and not joinable
        className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${locked || (canJoin === false && role === 'none')
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
          : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
          }`}
      >
        {locked ? 'Locked (Reach level 5)' : canJoin ? 'Join Team' : role === 'leader' ? 'Manage Team' : 'View Team'}
      </button>
    </div>
  );
};
