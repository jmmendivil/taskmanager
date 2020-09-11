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

const _tasks = [
  {
    title: 'A Sed explicabo voluptate a ex alias esse ',
    duration: 30,
    progress: 233,
    created: 23947829,
    updates: [
      [32423, 23423],
      [32423, 23423],
      [32423, 23423]
    ]
  },
  {
    title: 'B Illo provident repellat',
    duration: 45,
    progress: 23,
    created: 2349087,
    updates: [
      [32423, 23423],
      [32423, 23423],
      [32423, 23423]
    ]
  },
  {
    title: 'C Dolor odit quod voluptatum nulla totam',
    duration: 60,
    progress: 23,
    created: 23084029,
    updates: [
      [32423, 23423],
      [32423, 23423],
      [32423, 23423]
    ]
  }
]

function App () {
  const {
    tasks,
    firstTask,
    createTask,
    updateTask,
    deleteTask
  } = useTasks(
    // initial tasks
    _tasks,
    // create emtpy task
    () => ({ ...TASK_MODEL, created: Date.now() })
  )

  const {
    status,
    progress,
    startChronometer,
    stopChronometer
  } = useChronometer()

  const handleChronoStart = () => {
    const now = Date.now()
    firstTask.updates.unshift([now])
    // run chronometer
    startChronometer(firstTask.duration, firstTask.progress, now)
  }
  const handleChronoStop = () => {
    // update end-date
    firstTask.updates[0].push(Date.now())
    // update progress
    const { diff } = getDiffs(firstTask.updates[0], firstTask.progress)
    firstTask.progress = diff
    stopChronometer()
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
// <Button><Trash color='#dc3545'/></Button>
// <Card.Text>
// With supporting text below as a natural lead-in to additional content.
  // </Card.Text>
export default App
