import React from 'react'
import { Table } from 'react-bootstrap'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import ItemTask from './components/ItemTask'

export default function TasksList ({ tasks = [], handleDragEnd = () => {}, updateTask = () => {}, deleteTask = () => {}, isChronoRunning = false }) {
  const hasTasks = (tasks.length > 0)
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Table className='table--dnd'>
        <Droppable droppableId='9999'>
          {provided => (
            <tbody
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
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
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  )
}
