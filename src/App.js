import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import { Plus } from 'react-bootstrap-icons'
import { TASK_MODEL } from './models/task.model'
import Chronometer from './components/Chronometer/Chronometer'
import useChronometer from './hooks/useChronometer'
import getDiffs from 'Utils/getDiffsTime'
import TasksList from './components/TasksList/TasksList'

function App () {
  // -- Tasks
  const { tasks, firstTask, createTask, updateTask, deleteTask, setTasks } = useTasks(
    () => ({ ...TASK_MODEL, created: Date.now() })
  )
  const hasTasks = (tasks.length > 0)
  // simple validation
  // y u no use current emtpy-task? ლ(ಠ益ಠლ)
  const handleCreateTask = () => {
    if (firstTask.title === '') return
    createTask()
  }

  // running task is always the first one
  // mark done and move it to the end
  const handleDoneTask = () => {
    stopChronometer()
    // no need to update task
    // because next step is to swap
    firstTask.done = true
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
    // update first tasks
    updateTask(0)(firstTask)
  }
  // show labels with first task progress
  useEffect(() => {
    if (typeof firstTask === 'undefined') return
    resetChronometer(firstTask.duration, firstTask.progress)
  }, [firstTask])

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
  }, [isChronoRunning])

  // intercept chrono status
  let isChronoDisabled
  if (firstTask) {
    isChronoDisabled = (firstTask.done || firstTask.title === '')
  } else {
    isChronoDisabled = true // no firstTask, disable chronometer
  }

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

  return (
    <Container>
      <Row>
        <Col><h1 className='display-4'>Task Tracker</h1></Col>
      </Row>

      <Row>
        <Col>
          <Button onClick={handleCreateTask} disabled={isChronoRunning}>
            <Plus /> Nueva Tarea
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
