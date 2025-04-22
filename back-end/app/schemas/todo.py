from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    description: str | None = None
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
    description: str | None = None
    completed: bool
    image_path: str | None = None

    class Config:
        from_attributes = True