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
  const { tasks, firstTask, createTask, updateTask, deleteTask } = useTasks(
    _tasks,
    () => ({ ...TASK_MODEL, created: Date.now() })
  )

  const { status, progress, startChronometer, stopChronometer } = useChronometer()

  const handleChronoStart = () => {
    // update start-date
    const now = Date.now()
    firstTask.updates.unshift([now])
    // run chronometer
    startChronometer(firstTask.duration, firstTask.progress, now)
  }
  const handleChronoStop = () => {
    // stop chronometer
    stopChronometer()
    // update end-date
    firstTask.updates[0].push(Date.now())
    // update progress
    const { diff } = getDiffs(firstTask.updates[0], firstTask.progress)
    firstTask.progress = diff
    // update first & all tasks
    updateTask(0)(firstTask)
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
          <Button onClick={createTask} disabled={isChronoRunning}>
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
              status={status}
              title={tasks[0].title}
              time={progress[1]}
              pct={progress[0]}
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
