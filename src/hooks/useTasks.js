import taskSeed from '../models/tasks.seed'
import { useState, useEffect, useCallback, useMemo } from 'react'

// load previous tasks
let savedTasks = window.localStorage.getItem('arkon_tasks')
// if (!savedTasks) savedTasks = [] // use seeds on first use - you can use empty array too []
if (!savedTasks) savedTasks = taskSeed // use seeds on first use - you can use empty array too []
if (typeof savedTasks === 'string') savedTasks = JSON.parse(savedTasks)

export default function useTasks (newTaskModelFn) {
  const [tasks, setTasks] = useState((savedTasks.length) ? savedTasks : [newTaskModelFn()])
  const [firstTask, setFirstTask] = useState(savedTasks[0] || newTaskModelFn())
  const [filtersDoneTasks, setFiltersDoneTasks] = useState([])

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

  // filter done task - and apply custom filters
  const doneTasks = useMemo(() => {
    let done = tasks.filter(t => t.done)
    if (filtersDoneTasks.length > 0) {
      // iterate filters array (filtersDoneTasks) and apply
      // each function, use 'done' var as filter subject and accumulator
      // that way each iteration (filter) applies on top of the previous
      const doneFiltered = filtersDoneTasks.reduce((acc, curr) => {
        return acc.filter(curr)
      }, done)
      done = doneFiltered
    }
    return done
  }, [tasks, filtersDoneTasks])

  // filter pending tasks - or create dummy one
  const pendingTasks = useMemo(() => {
    const pending = tasks.filter(t => !t.done)
    // create dummy task if pending is empty
    // the real one will be created in state once the user
    // press the Done (edit) button
    return (pending.length === 0)
      ? [newTaskModelFn()]
      : pending
  }, [tasks, newTaskModelFn])

  return {
    tasks,
    pendingTasks,
    doneTasks,
    setFiltersDoneTasks,
    firstTask,
    createTask,
    updateTask,
    deleteTask,
    setTasks
  }
}
