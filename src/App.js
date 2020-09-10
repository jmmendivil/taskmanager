import React, { useState } from 'react'
import { Container, Row, Col, Button, Table, Card, ProgressBar } from 'react-bootstrap'
import { Plus, Play, Stop } from 'react-bootstrap-icons'
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
    _tasks,
    () => ({ ...TASK_MODEL, created: Date.now() })
  )

  return (
    <Container>
      <Row>
        <Col>Arkon Timer App</Col>
      </Row>

      <Row>
        <Col>
          <Button onClick={createTask}>
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
