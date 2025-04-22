from sqlalchemy.orm import Session
from app.models.todo import Todo
import os
from pathlib import Path

def get_all(db: Session):
    return db.query(Todo).all()

def get_todo(db: Session, todo_id: int):
    return db.query(Todo).filter(Todo.id == todo_id).first()

def create_todo(db: Session, todo_data: dict):
    db_todo = Todo(**todo_data)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, data: dict):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    
    # Xử lý thay đổi đường dẫn hình ảnh
    if 'image_path' in data:
        # Trường hợp 1: Hình ảnh đang bị xóa
        if data['image_path'] is None and todo.image_path:
            try:
                if os.path.exists(todo.image_path):
                    os.remove(todo.image_path)
                # Đặt đường dẫn hình ảnh thành None
                data['image_path'] = None
            except Exception as e:
                print(f"Lỗi khi xóa tệp hình ảnh: {e}")
        # Trường hợp 2: Hình ảnh đang được thay thế
        elif data['image_path'] != todo.image_path and todo.image_path:
            try:
                if os.path.exists(todo.image_path):
                    os.remove(todo.image_path)
            except Exception as e:
                print(f"Lỗi khi xóa tệp hình ảnh cũ: {e}")
    
    # Cập nhật các trường của todo
    for key, value in data.items():
        setattr(todo, key, value)
    
    db.commit()
    return todo

def delete_todo(db: Session, todo_id: int):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    
    # Xóa file hình ảnh nếu tồn tại
    if todo and todo.image_path:
        try:
            # Đường dẫn tuyệt đối
            if os.path.exists(todo.image_path):
                os.remove(todo.image_path)
        except Exception as e:
            print(f"Lỗi khi xóa file hình ảnh: {e}")
    
    # Xóa bản ghi từ database
    db.delete(todo)
    db.commit()
    return {"message": "Deleted"}