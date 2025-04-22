// TodoList.js
import React, { useState, useEffect } from "react";
import { List, Button, Checkbox } from "antd";
import { deleteTodo, getTodos, updateTodo } from "../api/todoApi";

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos(); // Reload todos after deletion
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await updateTodo(id, { completed: !completed });
      fetchTodos(); // Reload todos after update
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={todos}
      renderItem={(todo) => (
        <List.Item
          actions={[
            <Button onClick={() => handleDelete(todo.id)} type="link">
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={
              <Checkbox
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
              >
                {todo.title}
              </Checkbox>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default TodoList;
