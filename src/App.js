import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Badge, Table } from 'react-bootstrap'
import { Trash, Check, Pencil, Plus } from 'react-bootstrap-icons'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// 30, 45, 60

const DURATION = {
  SHORT: 30,
  MIDDLE: 45,
  LARGE: 60
}
const DURATION_LABELS = {
  SHORT: 'Corta',
  MIDDLE: 'Media',
  LARGE: 'Larga'
}

// Use for new tasks
const TASK_MODEL = {
  title: '',
  duration: 30, // minutes
  progress: 0, // millis - calculated from updates array
  created: '', // update on creation
  updates: [] // array with start-date and end-date of each update
}

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

function ItemTask ({ task, onUpdate, onDelete, disabled }) {
  const [editing, setEdit] = useState(false)
  const [_title, setTitle] = useState(task.title)
  const [_duration, setDuration] = useState(task.duration)

  const handleEditClick = () => setEdit(true)
  const handleSaveClick = () => {
    if (_title === '') return
    task.title = _title
    task.duration = _duration
    setEdit(false)
    onUpdate(task)
  }
  const handleDeleteClick = () => {
    // show alert message?
    setEdit(false)
    onDelete()
  }
  const handleCustomDuration = e => {
    const duration = +e.target.value
    if (duration > 0 && duration < 120) setDuration(duration)
  }

  const DurationBadge = () => {
    let label
    switch (_duration) {
      case (DURATION.SHORT):
        label = DURATION_LABELS.SHORT
        break
      case (DURATION.MIDDLE):
        label = DURATION_LABELS.MIDDLE
        break
      case (DURATION.LARGE):
        label = DURATION_LABELS.LARGE
        break
      default:
        label = _duration + 'min'
        break
    }
    return <Badge variant='light'>{label}</Badge>
  }

  useEffect(() => {
    if (task.title === '') setEdit(true)
  }, [task.title])

  const disabledClass = (disabled) ? 'disabled' : ''
  // const isCustomDuration = (_duration !== DURATION.SHORT && _duration !== DURATION.MIDDLE && _duration !== DURATION.LARGE)

  if (editing) {
    return (
      <>
        <tr className='task-item is-editing'>
          <td>
            <input
              type='text'
              value={_title}
              onChange={e => setTitle(e.target.value)}
              className='form-control'
              placeholder='Tarea'
            />
          </td>
          <td colSpan={2}>
            <input
              type='number'
              min={1}
              max={120}
              onChange={handleCustomDuration}
              className='form-control form-control-xs'
              placeholder='Custom'
              value={_duration}
            />
            <Badge onClick={() => setDuration(DURATION.SHORT)} variant={(_duration === DURATION.SHORT) ? 'dark' : 'light'}>Corta</Badge>
            <Badge onClick={() => setDuration(DURATION.MIDDLE)} variant={(_duration === DURATION.MIDDLE) ? 'dark' : 'light'}>Media</Badge>
            <Badge onClick={() => setDuration(DURATION.LARGE)} variant={(_duration === DURATION.LARGE) ? 'dark' : 'light'}>Larga</Badge>
          </td>
        </tr>
        <tr className='tr--controls'>
          <td colSpan={1} className='td--delete'>
            <Button onClick={handleDeleteClick} variant='link'><Trash color='#dc3545' /></Button>
          </td>
          <td colSpan={2}>
            <Button variant='success' size='sm' onClick={handleSaveClick} block><Check /></Button>
          </td>
        </tr>
      </>
    )
  } else {
    return (
      <tr className={disabledClass + ' task-item'}>
        <td>{_title}</td>
        <td><DurationBadge /></td>
        <td className='td--actions'>
          <Button variant='outline-secondary' size='sm' onClick={handleEditClick} className='button--action'><Pencil /></Button>
        </td>
      </tr>
    )
  }
}

function App () {
  const [tasks, setTasks] = useState(_tasks)
  const createEmtpyTask = () => {
    const newTasks = [...tasks]
    const newModel = { ...TASK_MODEL, created: Date.now() }
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

  return (
    <Container>
      <Row>
        <Col>Arkon Timer App</Col>
      </Row>

      <Row>
        <Col>
          <Button onClick={createEmtpyTask}>
            <Plus /> Nueva Tarea
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Table>
            <tbody>
              {tasks.map((task, i) => (
                <ItemTask
                  key={task.created}
                  index={i}
                  onUpdate={updateTask(i)}
                  onDelete={deleteTask(i)}
                  task={task}
                />
              ))}
            </tbody>
          </Table>
        </Col>
        <Col>
          TIMER
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
