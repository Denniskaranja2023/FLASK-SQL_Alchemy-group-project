from faker import Faker
import random

fake=Faker()
from models import db, Course, Student
from app import app

with app.app_context():
    Course.query.delete()
    Student.query.delete()
    
    cyber_security= Course(
        name= "Cyber Security",
        description= fake.sentence(),
        credits= random.randint(1,10)
    )
    
    software_engineering= Course(
        name= "Software Engineering",
        description= fake.sentence(),
        credits= random.randint(1,10)
    )
    
    data_science= Course(
        name= "Data Science",
        description= fake.sentence(),
        credits= random.randint(1,10)
    )
    db.session.add_all([cyber_security, software_engineering, data_science])
    db.session.commit()
    
    students=[]
    for i in range(20):
        student= Student(
            name=fake.name(),
            email= fake.email(),
            course_id= random.randint(1,3)             
        )
        students.append(student)
    db.session.add_all(students)
    db.session.commit()
        
        
        
