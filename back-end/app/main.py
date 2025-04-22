from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import todo
from app.database import engine, Base
from pathlib import Path

# Create uploads directory if it doesn't exist
Path("uploads").mkdir(exist_ok=True)

# Xóa và tạo lại DB (chỉ dùng trong môi trường phát triển)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mount the static files directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL (adjust if different)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(todo.router, prefix="/api/todos", tags=["Todos"])