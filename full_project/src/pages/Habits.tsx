import { useData } from "../contexts/DataContext";

export default function Habits() {
  const { habits, addHabit, removeHabit, completeHabit } = useData();

  const handleAdd = () => {
    const name = prompt("Enter habit name:");
    if (name) {
      addHabit({ name, frequency: "daily" });
    }
  };

  return (
    <div>
      <h2>Your Habits</h2>
      <button onClick={handleAdd}>➕ Add Habit</button>
      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            {habit.name} – {habit.completions} times
            <button onClick={() => completeHabit(habit.id)}> Complete</button>
            <button onClick={() => removeHabit(habit.id)}> Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
