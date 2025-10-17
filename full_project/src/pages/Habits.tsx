import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { CreateHabitModal } from "../components/CreateHabitModal";

export default function Habits() {
  const { habits, addHabit, removeHabit, completeHabit } = useData();
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Habits</h1>
          <p className="text-sm text-gray-500">Track daily tasks and earn rewards for consistency.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all"
          >
            ➕ Add Habit
          </button>
          <button
            onClick={() => {
              // quick-add fallback for power users
              const name = prompt("Quick add habit (name):");
              if (name) addHabit({ name, frequency: "daily" } as any);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Quick Add
          </button>
        </div>
      </header>

      <section>
        {habits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-indigo-100 p-8 text-center text-gray-500">
            No habits yet — create your first habit to begin earning XP and building streaks.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <article key={habit.id} className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition-all border border-indigo-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{habit.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">{habit.frequency || 'daily'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Completions</div>
                    <div className="text-xl font-bold text-indigo-600">{habit.completions ?? 0}</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => completeHabit(habit.id)}
                    className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showModal && <CreateHabitModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
