from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    image_path: str | None = None
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    completed: bool | None = None
    image_path: str | None = None

    
class TodoOut(TodoBase):
    id: int
    title: str
    completed: bool
    image_path: str | None = None

    class Config:
        from_attributes = True