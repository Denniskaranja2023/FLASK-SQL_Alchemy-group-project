import { useState, useEffect } from 'react'
import './App.css'
import NewCourseForm from './NewCourseForm'

function App() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingCourseId, setEditingCourseId] = useState(null) // track which course is being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
  })

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
    const confirmMessage = confirm("Are you sure you want to delete this course?")
    if (!confirmMessage) return
    const courseId = Number(event.target.id)
    const filteredCourses = courses.filter(course => course.id !== courseId)

    fetch(`http://127.0.0.1:5555/courses/${courseId}`,{ 
      method: 'DELETE',
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(() => setCourses(filteredCourses))
  }
  
  function handleChange(event){
    setEditFormData({
      ...editFormData,
      [event.target.name]: event.target.value
    })
  }
  
  function handleEdit(event){
    event.preventDefault()
    const courseId = editingCourseId
    const oldCourse = courses.find(c => c.id === courseId)
    const updatedData = { ...oldCourse, ...editFormData }

    fetch(`http://127.0.0.1:5555/courses/${courseId}`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(updatedCourse => {
        setCourses(courses.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        ))
        setEditingCourseId(null) // close the form
      })
      .catch(error => console.error("Error updating course:", error))
  }

  if (loading) return <p>Loading courses...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div className="courses">
      <h1 style={{textDecoration:"underline"}}>Available Courses:</h1>
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <h2>{course.name}</h2>
          <p>{course.description}</p>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={handleDelete} id={course.id} className="delete-btn">Delete</button>
            <button 
              onClick={() => {
                setEditingCourseId(course.id)
                setEditFormData({ name: course.name, description: course.description }) // prefill form
              }}
              className="delete-btn"
            >
              Edit
            </button>
          </div>

          {editingCourseId === course.id && (
            <form onSubmit={handleEdit} className="custom-form">
              <label className="form-label">
                New name:
                <input 
                  name="name"
                  value={editFormData.name}
                  onChange={handleChange}
                  type="text"
                  className="form-input"
                />
              </label>
              <label className="form-label">
                New description:
                <input 
                  type="text"
                  name="description"
                  value={editFormData.description}
                  onChange={handleChange}
                  className="form-input"
                />
              </label>
              <button type="submit" style={{ marginTop:"20px" }} className="delete-btn">Submit</button>
              <button 
                type="button" 
                onClick={() => setEditingCourseId(null)} 
                style={{ marginTop:"20px", marginLeft:"10px" }} 
                className="delete-btn"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      ))}
       <NewCourseForm courses={courses} setCourses={setCourses}/>
    </div>
  )
}

export default App
