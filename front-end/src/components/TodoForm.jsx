// TodoForm.js
import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import { createTodo } from "../api/todoApi";

const TodoForm = ({ fetchTodos }) => {
  const [todoTitle, setTodoTitle] = useState("");

  const handleAddTodo = async () => {
    if (todoTitle.trim()) {
      try {
        await createTodo({ title: todoTitle, completed: false });
        setTodoTitle(""); // Clear input field after adding
        fetchTodos(); // Reload todos after adding
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  return (
    <Form layout="inline">
      <Form.Item>
        <Input
          placeholder="Enter todo title"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleAddTodo}>
          Add Todo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TodoForm;
