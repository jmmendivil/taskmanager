import _tasks from '../models/tasks.seed'
import { useState, useEffect, useCallback, useMemo } from 'react'

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
  const updateTask = useCallback(index => updatedTask => {
    const newTasks = [...tasks]
    newTasks[index] = updatedTask
    setTasks(newTasks)
  }, [tasks])
  const deleteTask = index => () => {
    const newTasks = [...tasks]
    newTasks.splice(index, 1)
    setTasks(newTasks)
  }

  const doneTasks = useMemo(() => tasks.filter(t => t.done), [tasks])
  const pendingTasks = useMemo(() => {
    const pending = tasks.filter(t => !t.done)
    // create dummy task
    // the real one will be created in state once the user
    // press the Done (edit) button
    return (pending.length === 0)
      ? [newTaskModelFn()]
      : pending
  }, [tasks, newTaskModelFn])

  return { tasks, pendingTasks, doneTasks, firstTask, createTask, updateTask, deleteTask, setTasks }
}
