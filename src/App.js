import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useCallback } from 'react'
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import { Plus } from 'react-bootstrap-icons'
import useTasks from './hooks/useTasks'
import { TASK_MODEL } from './models/task.model'
import Chronometer from './components/Chronometer/Chronometer'
import useChronometer from './hooks/useChronometer'
import getDiffs from 'Utils/getDiffsTime'
import TasksList from './components/TasksList/TasksList'

function App () {
  // -- Tasks
  const createEmptyTask = useCallback(() => ({ ...TASK_MODEL, created: Date.now() }), [])
  const { tasks, pendingTasks, doneTasks, firstTask, createTask, updateTask, deleteTask, setTasks } = useTasks(createEmptyTask)
  const hasTasks = (tasks.length > 0)

  // simple validation
  // y u no use current emtpy-task? ლ(ಠ益ಠლ)
  const handleCreateTask = () => {
    if (firstTask.title === '') return
    createTask()
  }

  // side effect
  const addUpdateToFirstTask = (status = false, now = Date.now()) => {
    firstTask.updates.unshift(
      (status) ? [now, status] : [now]
    )
  }

  // running task is always the first one
  // mark done and move it to the end
  // (done task cant be the first one)
  const handleDoneTask = () => {
    // stop chrono and save latest update
    if (isChronoRunning) handleChronoStop()
    else stopChronometer()
    firstTask.done = true
    // add update with DONE status
    addUpdateToFirstTask('DONE')
    // swap tasks
    const newTasks = [...tasks]
    newTasks.shift()
    newTasks.push(firstTask)
    setTasks(newTasks)
  }

  // -- Chronometer
  const { status, progress, startChronometer, stopChronometer, resetChronometer } = useChronometer()
  const isChronoRunning = (status === 'started')

  const handleChronoStart = () => {
    // update latest start-date
    const now = Date.now()
    addUpdateToFirstTask(false, now)
    startChronometer(firstTask.duration, firstTask.progress, now)
  }
  // with hook because its used with useEffect
  const handleChronoStop = useCallback(() => {
    stopChronometer()
    // update latest end-date
    firstTask.updates[0].push(Date.now())
    // update progress: current progress + previous progress
    const { diff } = getDiffs(firstTask.updates[0], firstTask.progress)
    firstTask.progress = diff
    // update first tasks
    updateTask(0)(firstTask)
  }, [firstTask, stopChronometer, updateTask])

  const handleChronoReset = () => {
    stopChronometer()
    addUpdateToFirstTask('RESET')
    firstTask.progress = 0
    updateTask(0)(firstTask)
  }
  // stop chronometer on window close
  useEffect(() => {
    if (isChronoRunning) {
      const handleBeforeunload = evt => {
        handleChronoStop()
        evt.preventDefault()
        evt.returnValue = ''
      }
      window.addEventListener('beforeunload', handleBeforeunload)
      return () => { window.removeEventListener('beforeunload', handleBeforeunload) }
    }
  }, [isChronoRunning, handleChronoStop])

  // intercept chrono status
  const isChronoDisabled = (firstTask.done || firstTask.title === '')

  // --- DnD
  const handleDragEnd = result => {
    const { source, destination } = result

    if (!destination) return
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) return

    const newTasks = [...tasks]
    newTasks.splice(source.index, 1)
    newTasks.splice(destination.index, 0, tasks[source.index])
    setTasks(newTasks)
  }

  // show labels with (peding) first task progress
  useEffect(() => {
    resetChronometer(pendingTasks[0].duration, pendingTasks[0].progress)
  }, [pendingTasks, resetChronometer])

  return (
    <Container>
      <Row>
        <Col><h1 className='display-4'>Task Tracker</h1></Col>
      </Row>

      <Row>
        <Col>
          <Button
            className='float-right'
            onClick={handleCreateTask}
            disabled={isChronoRunning}
          ><Plus /> Nueva Tarea
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          {(hasTasks) && (
            <Chronometer
              status={(isChronoDisabled) ? 'disabled' : status}
              title={pendingTasks[0].title}
              time={progress[1]}
              pct={progress[0]}
              onDone={handleDoneTask}
              onStart={handleChronoStart}
              onStop={handleChronoStop}
              onReset={handleChronoReset}
            />
          )}
        </Col>
        <Col md={8}>
          <Tabs defaultActiveKey='tasks'>
            <Tab eventKey='icon' title='🗒' disabled></Tab>
            <Tab eventKey='tasks' title='Pendientes'>
              <TasksList
                tasks={pendingTasks}
                handleDragEnd={handleDragEnd}
                updateTask={updateTask}
                deleteTask={deleteTask}
                isChronoRunning={isChronoRunning}
              />
            </Tab>
            <Tab eventKey='done' title='Completadas'>
              <TasksList tasks={doneTasks} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  )
}
export default App
