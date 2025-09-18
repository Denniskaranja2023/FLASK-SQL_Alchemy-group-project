import { useState, useEffect } from 'react'
import './App.css'

function NewCourseForm({setCourses, courses}){
const[formData, setFormData]= useState({
    name:"",
    description:"",
})
function handleChange(event){
  setFormData({
    ...formData,
    [event.target.name]: event.target.value
  })
}
function handleSubmit(event){
    event.preventDefault();
     fetch('http://127.0.0.1:5555/courses',{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
     })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch courses")
        return res.json()
      }).then((newCourse)=>{
        setCourses([...courses, newCourse])
        setFormData({name:"", description:"",})
    }).catch(error=>console.error("Error in creating a new course:", error))
}

 return(
    <div>
        <form onSubmit={handleSubmit}>
            <h2>Add a new Course</h2>
            <label className="form-label">
            Name:
            <input 
            name="name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            />
            </label>
            <label className="form-label">
            New description:
            <input 
            type="text"
            name="description"
            className="form-input"
            value={formData.description}
            onChange={handleChange}
            />
            </label>
            <button type="submit" style={{ marginTop:"20px" }} className="delete-btn">Submit</button>
        </form>
    </div>
 )
}

export default NewCourseForm