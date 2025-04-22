import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Avatar,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { getTodos, createTodo, deleteTodo, updateTodo } from "./api/todoApi";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  // States for editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const fetchTodos = async () => {
    const res = await getTodos();
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async () => {
    await createTodo({
      title,
      completed: false,
      image,
    });
    setTitle("");
    setImage(null);
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const toggleCompleted = async (task) => {
    await updateTodo(task.id, { completed: !task.completed });
    fetchTodos();
  };

  // Start editing a todo
  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditImage(null);
    setRemoveImage(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditImage(null);
    setRemoveImage(false);
  };

  // Save edited todo
  const handleSaveEdit = async () => {
    const updateData = { title: editTitle, image: null };

    // Xử lý hình ảnh
    if (editImage) {
      updateData.image = editImage; // Gửi hình ảnh mới để thay thế
    }

    await updateTodo(editingId, updateData);
    setEditingId(null);
    setEditTitle("");
    setEditImage(null);
    setRemoveImage(false);
    fetchTodos();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        📝 Todo App
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <TextField
          label="Tiêu đề công việc"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button variant="contained" onClick={handleAdd}>
          Thêm
        </Button>
      </Box>

      <List>
        {tasks.map((task) => (
          <Paper key={task.id} elevation={1} sx={{ mb: 2, overflow: "hidden" }}>
            {editingId === task.id ? (
              // Giao diện chỉnh sửa
              <Box p={2}>
                <TextField
                  fullWidth
                  label="Tiêu đề"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Box display="flex" alignItems="center" mb={2}>
                  {task.image_path && !removeImage && (
                    <Box mr={2} position="relative">
                      <Avatar
                        src={
                          editImage
                            ? URL.createObjectURL(editImage)
                            : `http://127.0.0.1:8000${
                                task.image_path.startsWith("/")
                                  ? task.image_path
                                  : "/" + task.image_path
                              }`
                        }
                        sx={{ width: 48, height: 48 }}
                        alt={task.title}
                      />
                      <IconButton
                        size="small"
                        onClick={() => setRemoveImage(true)}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "background.paper",
                          border: "1px solid #ccc",
                          width: 20,
                          height: 20,
                        }}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setEditImage(e.target.files[0]);
                        setRemoveImage(false);
                      }}
                    />
                    {removeImage && (
                      <Typography variant="caption" color="text.secondary">
                        Hình ảnh sẽ bị xóa
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    startIcon={<CancelIcon />}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveEdit}
                    startIcon={<SaveIcon />}
                    color="primary"
                  >
                    Lưu
                  </Button>
                </Box>
              </Box>
            ) : (
              // Giao diện hiển thị bình thường
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(task)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleCompleted(task)}
                />
                {task.image_path && (
                  <Avatar
                    src={`http://127.0.0.1:8000${
                      task.image_path.startsWith("/")
                        ? task.image_path
                        : "/" + task.image_path
                    }`}
                    sx={{ width: 48, height: 48, mr: 2 }}
                    alt={task.title}
                    onError={(e) => {
                      console.error("Lỗi tải ảnh:", e);
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/48"; // Ảnh thay thế
                    }}
                  />
                )}
                <ListItemText
                  primary={task.title}
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                />
              </ListItem>
            )}
          </Paper>
        ))}
      </List>
    </Container>
  );
}

export default App;
