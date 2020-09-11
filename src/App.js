import React from 'react'
import { Container, Row, Col, Button, Table } from 'react-bootstrap'
import { Plus } from 'react-bootstrap-icons'
import ItemTask from './components/ItemTask/ItemTask'
import useTasks from './hooks/useTasks'
import { TASK_MODEL } from './models/task'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Chronometer from './components/Chronometer/Chronometer'
import useChronometer from './hooks/useChronometer'
import getDiffs from './utils/getDiffs'
import _tasks from './models/tasks.seed'

function App () {
  const { tasks, firstTask, createTask, updateTask, deleteTask, setTasks } = useTasks(
    _tasks,
    () => ({ ...TASK_MODEL, created: Date.now() })
  )

  // simple validation
  // y u no use current emtpy-task? ლ(ಠ益ಠლ)
  const handleCreateTask = () => {
    if (firstTask.title === '') return
    resetLabels()
    createTask()
  }

  // running task is always the first one
  // mark done and move it to the end
  const handleDoneTask = () => {
    stopChronometer()
    resetLabels()

    // no need to update task
    // because next step is to swap
    firstTask.done = true

    // swap tasks
    const newTasks = [...tasks]
    newTasks.shift()
    newTasks.push(firstTask)
    setTasks(newTasks)
  }

  const { status, progress, startChronometer, stopChronometer, resetLabels } = useChronometer()

  const handleChronoStart = () => {
    // update latest start-date
    const now = Date.now()
    firstTask.updates.unshift([now])
    startChronometer(firstTask.duration, firstTask.progress, now)
  }
  const handleChronoStop = () => {
    stopChronometer()
    // update latest end-date
    firstTask.updates[0].push(Date.now())
    // update progress: current progress + previous progress
    const { diff } = getDiffs(firstTask.updates[0], firstTask.progress)
    firstTask.progress = diff
    // update first tasks (and all, because internal useEffect)
    updateTask(0)(firstTask)
  }

  // intercept chrono status
  let isChronoDisabled
  if (firstTask) {
    isChronoDisabled = (firstTask.done || firstTask.title === '')
  } else {
    isChronoDisabled = true // no firstTask, disable chronometer
  }

  const hasTasks = (tasks.length > 0)
  const isChronoRunning = (status === 'started')

  return (
    <Container>
      <Row>
        <Col>Arkon Timer App</Col>
      </Row>

      <Row>
        <Col>
          <Button onClick={handleCreateTask} disabled={isChronoRunning}>
            <Plus /> Nueva Tarea
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Table>
            <tbody>
              {(hasTasks) && tasks.map((task, i) => (
                <ItemTask
                  key={task.created}
                  index={i}
                  onUpdate={updateTask(i)}
                  onDelete={deleteTask(i)}
                  disabled={isChronoRunning}
                  task={task}
                />
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={4}>
          {(hasTasks) && (
            <Chronometer
              status={(isChronoDisabled) ? 'disabled' : status}
              title={tasks[0].title}
              time={progress[1]}
              pct={progress[0]}
              onDone={handleDoneTask}
              onStart={handleChronoStart}
              onStop={handleChronoStop}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}
export default App
