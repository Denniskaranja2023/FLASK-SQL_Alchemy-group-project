from flask import Flask, make_response, request
from models import db, Student, Course
from flask_restful import Api,Resource
from flask_cors import CORS


from flask_migrate import Migrate

app=Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]= False
app.json.compact = False

migrate = Migrate(app,db)
db.init_app(app)
CORS(app)

api=Api(app)

class Courses(Resource):
    def get(self):
        courses= Course.query.all()
        courses_dict=[course.to_dict(rules=('-students',)) for course in courses]
        response= make_response(courses_dict, 200)
        return response
    def post(self):
        data= request.get_json()
        new_course= Course(
            name= data.get('name'),
            description= data.get('description'),
            credits= data.get('credits') 
        )
        db.session.add(new_course)
        db.session.commit()
        new_course_dict= new_course.to_dict(rules=('-students',))
        response= make_response(new_course_dict, 201)
        return response
api.add_resource(Courses, '/courses')

class CourseById(Resource):
    def get(self, id):
        course= Course.query.get(id)
        course_dict= course.to_dict(rules=('-students',))
        response= make_response(course_dict, 200)
        return response
    def delete(self, id):
        course= Course.query.get(id)
        db.session.delete(course)
        db.session.commit()
        response_body= {"message":"Course successfully deleted"}
        return make_response(response_body, 200)
    def put(self,id):
        course=Course.query.get(id)
        data=request.get_json()  
        for attr in data:
            setattr(course, attr, data.get(attr))
        db.session.commit()
        response= make_response(course.to_dict(rules=('-students',)), 200)
        return response
            
api.add_resource(CourseById, '/courses/<int:id>')


if __name__=="__main__":
    app.run(port=5555,debug=True)
