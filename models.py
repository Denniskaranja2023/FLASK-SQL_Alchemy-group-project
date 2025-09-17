from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData



metadata= MetaData()

db= SQLAlchemy(metadata=metadata)

class Course(db.Model, SerializerMixin):
    
    __tablename__= "courses"
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, unique=True, nullable=False)
    description= db.Column(db.String)
    credits= db.Column(db.Integer, default=3)
    students= db.relationship('Student', back_populates="course", cascade='all')
    
    def __repr__(self):
        return f'<course {self.id}: course name:{self.name}: description:{self.description}, credits:{self.credits}>'

class Student(db.Model, SerializerMixin):
    __tablename__ = "students"
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.Integer,unique=True, nullable=False)
    email=db.Column(db.String, unique=True, nullable=False)
    course_id=db.Column(db.Integer, db.ForeignKey("courses.id"))
    course= db.relationship("Course", back_populates="students")
    
    def __repr__(self):
        return f'<student {self.id},{self.name},{self.email}>'
    