from sqlalchemy import Integer,Boolean
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, ForeignKey
from sqlalchemy import String, Date
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

Base = declarative_base()
engine = create_engine("postgresql:///Todolist", echo=True)
session = Session(engine)

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key = True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    todolists = relationship("AddTodolist", back_populates = "user")
class AddTodolist(Base):
    __tablename__ = "todolists"
    id = Column(Integer, primary_key =True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable = False)
    privacy = Column(String)
    user = relationship("Users", back_populates = "todolists")
    task = relationship("Task", back_populates = "todo")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key = True)
    name = Column(String)
    date = Column(Date)
    user_id = Column(Integer, ForeignKey("users.id"),nullable=False)
    todolist_id = Column(Integer, ForeignKey("todolists.id"), nullable=False)
    todo = relationship("todolists", back_populates = "tasks")

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

