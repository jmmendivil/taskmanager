import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Button, Badge } from 'react-bootstrap'
import { Trash, Check, Pencil, CheckCircleFill } from 'react-bootstrap-icons'
import { DURATION, DURATION_LABELS } from '../../config'

const TD_WIDTH = {
  fivepercent: { width: '5%' },
  tenpercent: { width: '10%' },
  fifteenpercent: { width: '15%' },
  onequarter: { width: '25%' },
  half: { width: '50%' },
  threequarters: { width: '75%' },
  full: { width: '100%' }
}

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

  // empty title means new task, edit asap
  useEffect(() => {
    if (task.title === '') setEdit(true)
  }, [task.title])

  const disabledClass = (disabled || task.done) ? 'disabled' : ''

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
          <td colSpan={2} style={TD_WIDTH.threequarters}>
            <input
              type='text'
              value={_title}
              onChange={e => setTitle(e.target.value)}
              className='form-control'
              placeholder='Tarea'
            />
          </td>
          <td colSpan={2} style={TD_WIDTH.onequarter}>
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
          <td colSpan={2} className='td--delete' style={TD_WIDTH.threequarters}>
            <Button onClick={handleDeleteClick} variant='link'><Trash color='#dc3545' /></Button>
          </td>
          <td colSpan={2} style={TD_WIDTH.onequarter}>
            <Button variant='success' size='sm' onClick={handleSaveClick} block><Check /></Button>
          </td>
        </tr>
      </>
    )
  }
  return (
    <Draggable
      draggableId={task.created + 'zzz'}
      index={index}
      isDragDisabled={task.done || disabled}
    >
      {(provided, snapshot) => (
        <tr
          className={disabledClass + ' task-item ' + getItemClass(snapshot.isDragging)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
        >
          <td style={TD_WIDTH.fivepercent}>
            {(task.done) && <CheckCircleFill className='text-success' />}
          </td>
          <td style={TD_WIDTH.threequarters}>
            {_title}
          </td>
          <td style={TD_WIDTH.tenpercent}>
            <DurationBadge />
          </td>
          <td className='td--actions' style={TD_WIDTH.tenpercent}>
            <Button variant='outline-secondary' size='sm' onClick={handleEditClick} className='button--action'><Pencil /></Button>
          </td>
        </tr>
      )}
    </Draggable>
  )
}
