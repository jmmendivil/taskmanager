import { useState, useEffect } from 'react'
export default function useTasks (initTasks, newTaskModelFn) {
  const [tasks, setTasks] = useState(initTasks)
  const [firstTask, setFirstTask] = useState()

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

  useEffect(() => {
    setFirstTask(
      // deep clone
      JSON.parse(JSON.stringify(tasks[0]))
    )
  }, [tasks])

  return { tasks, firstTask, createTask, updateTask, deleteTask, setTasks }
}
