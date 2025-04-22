import { useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
export default function App() {
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState(null);

  const reload = () => setRefresh(!refresh);

  return (
    <div>
      <h1>🧠 To-do App</h1>
      <TodoForm
        onSuccess={reload}
        editData={editData}
        clearEdit={() => setEditData(null)}
      />
      <TodoList key={refresh} onEdit={setEditData} />
    </div>
  );
}
