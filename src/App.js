import React, { useState } from 'react'
import { Container, Row, Col, Button, Table, Card, ProgressBar } from 'react-bootstrap'
import { Plus, Play, Stop, Check } from 'react-bootstrap-icons'
import ItemTask from './components/ItemTask/ItemTask'
import useTasks from './hooks/useTasks'
import { TASK_MODEL } from './models/task'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

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

  const [status, setStatus] = useState('stoped')
  // interval
  const [chronometer, setChronometer] = useState()
  // percent & label
  const [timerProgress, setTimerProgress] = useState([0, '00:00'])

  const getDiffs = ([start, end], prev) => {
    const diff = (end - start) + prev
    return {
      diff,
      secs: Math.floor((diff / 1000) % 60),
      mins: Math.floor((diff / 1000 / 60) % 60)
    }
  }

  const getProgressPct = (duration, progress) => {
    const durationMillis = duration * 60 * 1000
    return (progress / durationMillis) * 100
  }

  const formatTimeText = (mins, secs) => {
    const secsFormat = '0' + secs
    const minsFormat = '0' + mins
    return minsFormat.substr(-2) + ':' + secsFormat.substr(-2)
  }

  const initChronometer = (duration, prevProgress, startDate) => {
    setChronometer(
      setInterval(() => {
        const { diff, secs, mins } = getDiffs([startDate, +Date.now()], prevProgress)
        setTimerProgress([
          getProgressPct(duration, diff),
          formatTimeText(mins, secs)
        ])
      }, 1000)
    )
    setStatus('started')
  }

  const stopChronometer = () => {
    clearInterval(chronometer)
    setStatus('stoped')
  }

  const handleCounterStart = () => {
    const now = Date.now()
    firstTask.updates.unshift([now])
    // run chronometer
    initChronometer(firstTask.duration, firstTask.progress, now)
  }
  const handleCounterStop = () => {
    // update end-date
    firstTask.updates[0].push(Date.now())
    // update progress
    const { diff } = getDiffs(firstTask.updates[0], firstTask.progress)
    firstTask.progress = diff
    stopChronometer()
    updateTask(0)(firstTask)
  }

  const handleDoneTask = () => {
    console.log('DONE')
  }

  const hasTasks = (tasks.length > 0)
  const isChronoRunning = (status === 'started')
  const progressEnd = (timerProgress[0] >= 100)
  const progressVariant = (timerProgress[0] < 49) ? 'success'
    : (timerProgress[0] < 69) ? 'info'
      : (timerProgress[0] < 89) ? 'warning'
        : 'danger'

  const doneBtnVariation = (isChronoRunning) ? 'outline-success' : 'success'

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
            <Card>
              <Card.Header>
                {tasks[0].title}
              </Card.Header>
              <Card.Body>
                <div className='card-title h1 text-center text-monospace'>
                  {/* progress seconds to minutes */}
                  {timerProgress[1]}
                </div>
                <div className='text-center mb-3'>
                  <ProgressBar animated={progressEnd} variant={progressVariant} now={timerProgress[0]} />
                </div>
                <Row className='mr-0 ml-0'>
                  <Col sm={6}>
                    {(hasTasks) && (
                      <Button
                        onClick={(isChronoRunning) ? handleCounterStop : handleCounterStart}
                        variant='outline-primary'
                      >
                        {(isChronoRunning)
                          ? <><Stop /> Detener</>
                          : <><Play /> Iniciar</>}
                      </Button>
                    )}
                  </Col>
                  <Col sm={6}>
                    <Button
                      onClick={handleDoneTask}
                      variant={doneBtnVariation}>
                      <Check /> Terminar
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
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
