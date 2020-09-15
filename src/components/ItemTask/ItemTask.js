import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Button, Badge, ProgressBar } from 'react-bootstrap'

export default function ItemTask ({ task, index, onUpdate, onDelete, disabled }) {
  const [editing, setEdit] = useState(false)
  const [_title, setTitle] = useState(task.title)
  const [_duration, setDuration] = useState(task.duration)

  const handleEditClick = () => setEdit(true)
  const handleSaveClick = () => {
    if (_title === '') return // title, please
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
    if (duration > 0 && duration <= DURATION.LARGE) setDuration(duration)
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

  const DoneBadge = ({ progress }) => {
    const { mins, secs } = getDiffsTime([0, 0], progress)
    const doneTime = formatTimeText(mins, secs)
    return <Badge variant='success'>{doneTime}</Badge>
  }

  // empty title means new task, edit asap
  useEffect(() => {
    if (task.title === '') setEdit(true)
  }, [task.title])

  const disabledClass = (disabled || task.done) ? ' disabled ' : ''
  const doneClass = (task.done) ? ' done ' : ''

  const getItemClass = (isDragging) => {
    return (isDragging) ? 'is-dragging' : ''
  }

  const getItemStyle = (isDragging, _styles) => {
    return (isDragging)
      ? { ..._styles, display: 'table' }
      : _styles
  }

  // can't edit if it is disabled (chronometer running)
  if (editing && !disabled) {
    return (
      <>
        <tr className='task-item is-editing'>
          <td colSpan={2} className='w-75'>
            <input
              type='text'
              value={_title}
              onChange={e => setTitle(e.target.value)}
              className='form-control'
              placeholder='Tarea'
            />
          </td>
          <td colSpan={2} className='w-25'>
            <div className='input--custom-time mb-1 d-flex flex-row justify-content-around align-items-baseline'>
              <label>Duracion (min):</label>
              <input
                type='number'
                style={{ width: '50px', display: 'inline' }}
                min={1}
                max={120}
                onChange={handleCustomDuration}
                className='form-control'
                placeholder='Custom'
                value={_duration}
              />
            </div>
            <div className='d-flex flex-row justify-content-around'>
              <Badge onClick={() => setDuration(DURATION.SHORT)} variant={(_duration === DURATION.SHORT) ? 'dark' : 'light'}>Corta</Badge>
              <Badge onClick={() => setDuration(DURATION.MIDDLE)} variant={(_duration === DURATION.MIDDLE) ? 'dark' : 'light'}>Media</Badge>
              <Badge onClick={() => setDuration(DURATION.LARGE)} variant={(_duration === DURATION.LARGE) ? 'dark' : 'light'}>Larga</Badge>
            </div>
          </td>
        </tr>
        <tr className='tr--controls'>
          <td colSpan={2} className='td--delete w-75'>
            <Button onClick={handleDeleteClick} variant='link'><Trash color='#dc3545' /></Button>
          </td>
          <td colSpan={2} className='w-25'>
            <Button variant='success' size='sm' onClick={handleSaveClick} block><Check /></Button>
          </td>
        </tr>
      </>
    )
  }
  return (
    <Draggable
      index={index}
      draggableId={task.created + 'zzz'}
      isDragDisabled={task.done || disabled}
    >
      {(provided, snapshot) => (
        <>
          <tr
            className={doneClass + disabledClass + ' task-item ' + getItemClass(snapshot.isDragging)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          >
            {(task.done) && (
              <td><DoneBadge progress={task.progress} /></td>
            )}
            <td className='w-75'>
              {_title}
            </td>
            <td>
              <DurationBadge />
            </td>
            {(!task.done) && (
              <td className='td--actions'>
                <Button variant='outline-secondary' size='sm' onClick={handleEditClick} className='button--action'><Pencil /></Button>
              </td>
            )}
          </tr>
          {/* do not show progress on first task or task is done */}
          {(task.progress > 0 && index > 0 && !task.done) && (
            <tr className='tr--progress'>
              <td colSpan={4}>{<ProgressBar now={getProgressPct(task.duration, task.progress)} />}</td>
            </tr>
          )}
        </>
      )}
    </Draggable>
  )
}
