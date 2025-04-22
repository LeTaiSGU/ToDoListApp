from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.schemas.todo import TodoOut, TodoUpdate
from app.crud import todo as crud
from app.database import SessionLocal
from app.utils.file_utils import save_upload_file
from app.cache import r as redis_client
import json

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[TodoOut])
def read_todos(db: Session = Depends(get_db)):
    # Try to get from cache first (implementation will be added later)
    cached_todos = redis_client.get("todos")
    if cached_todos:
        return json.loads(cached_todos)
        
    # If not in cache, get from database
    todos = crud.get_all(db)
    
    # Cache the results (implementation will be added later)
    redis_client.set("todos", json.dumps([{
        "id": todo.id,
        "title": todo.title,
        "description": todo.description,
        "completed": todo.completed,
        "image_path": todo.image_path
    } for todo in todos]), ex=300)  # Cache for 5 minutes
    
    return todos

@router.post("/", response_model=TodoOut)
async def create_todo(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Handle file upload if provided
    image_path = None
    if image:
        image_path = await save_upload_file(image)
    
    # Create todo with image path
    todo_data = {
        "title": title,
        "description": description,
        "image_path": image_path
    }
    
    todo = crud.create_todo(db, todo_data)
    
    # Invalidate cache
    redis_client.delete("todos")
    
    return todo

@router.put("/{todo_id}", response_model=TodoOut)
async def update_todo(
    todo_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    completed: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Get current todo
    current_todo = crud.get_todo(db, todo_id)
    
    # Handle file upload if provided
    image_path = current_todo.image_path
    if image:
        image_path = await save_upload_file(image)
    
    # Update todo with image path
    todo_data = {
        "title": title if title is not None else current_todo.title,
        "description": description if description is not None else current_todo.description,
        "completed": completed if completed is not None else current_todo.completed,
        "image_path": image_path
    }
    
    updated_todo = crud.update_todo(db, todo_id, todo_data)
    
    # Invalidate cache
    redis_client.delete("todos")
    
    return updated_todo

@router.delete("/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    result = crud.delete_todo(db, todo_id)
    
    # Invalidate cache
    redis_client.delete("todos")
    
    return result