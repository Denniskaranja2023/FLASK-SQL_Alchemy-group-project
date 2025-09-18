import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const[ showForm, setShowForm]= useState(false)
  useEffect(() => {
    fetch('http://127.0.0.1:5555/courses')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch courses")
        return res.json()
      })
      .then(courses => {
        setCourses(courses)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  function handleDelete(event){
    const confirmMessage= confirm("Are you sure you want to delete this course?")
    if (! confirmMessage) return
    const courseId= Number(event.target.id)
    const filteredCourses= courses.filter(course=> course.id !== courseId)
    fetch(`http://127.0.0.1:5555/courses/${courseId}`,{ 
      method: 'DELETE',
      headers: {"Content-Type": "application/json",}}
    ).then(res=>res.json()).
    then(()=>setCourses(filteredCourses))
  }

  if (loading) return <p>Loading courses...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div className="courses">
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <h2>{course.name}</h2>
          <p>{course.description}</p>
         <div style={{display: "flex",justifyContent: "space-between",alignItems: "center",}}>
         <button onClick={event=>handleDelete(event)}id={course.id} className="delete-btn">Delete</button>
         <button id={course.id} onClick={()=>setShowForm(!showForm)}className="delete-btn">Edit</button>
         </div>
         <form className="custom-form" style={{display:showForm? 'block':'none'}}>
        <label className="form-label">
          New name:
          <input type="text" className="form-input" />
        </label>
        <label className="form-label">
          New description:
          <input type="text" className="form-input" />
        </label>
        <button type="submit" className="form-button">Submit</button>
        </form>
        </div>
      ))}
    </div>
  )
}

export default App
