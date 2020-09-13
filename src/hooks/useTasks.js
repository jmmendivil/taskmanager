import _tasks from '../models/tasks.seed'
import { useState, useEffect } from 'react'

// load previous tasks
let savedTasks = window.localStorage.getItem('arkon_tasks')
if (!savedTasks) savedTasks = _tasks // use seeds on first use
if (typeof savedTasks === 'string') savedTasks = JSON.parse(savedTasks)

export default function useTasks (newTaskModelFn) {
  const [tasks, setTasks] = useState(savedTasks)
  const [firstTask, setFirstTask] = useState(savedTasks[0])

  useEffect(() => {
    if (typeof tasks !== 'undefined') {
      // save tasks to storage
      window.localStorage.setItem('arkon_tasks', JSON.stringify(tasks))
      // update firstTask
      setFirstTask(
        JSON.parse(JSON.stringify(tasks[0])) // deep clone
      )
    }
  }, [tasks])

  const createTask = () => {
    const newTasks = [...tasks]
    const newModel = newTaskModelFn()
    newTasks.unshift(newModel)
    setTasks(newTasks)
  }
  const updateTask = index => updatedTask => {
    const newTasks = [...tasks]
    newTasks[index] = updatedTask
    setTasks(newTasks)
  }
  const deleteTask = index => () => {
    const newTasks = [...tasks]
    newTasks.splice(index, 1)
    setTasks(newTasks)
  }

  return { tasks, firstTask, createTask, updateTask, deleteTask, setTasks }
}
