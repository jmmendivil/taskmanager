import React from 'react'
import { Row, Col, Button, Card, ProgressBar } from 'react-bootstrap'
import { Play, Stop, Check } from 'react-bootstrap-icons'

export default function Chronometer ({ status, title, time, pct, onStart, onStop, onDone }) {
  const isChronoRunning = (status === 'started')
  const disabled = (status === 'disabled')
  const doneBtnVariation = (isChronoRunning) ? 'outline-success' : 'success'
  const progressEnd = (pct >= 100)
  const progressVariant = (pct < 49) ? 'success'
    : (pct < 69) ? 'info'
      : (pct < 89) ? 'warning'
        : 'danger'
  return (
    <Card>
      <Card.Header>
        {title}
      </Card.Header>
      <Card.Body>
        <div className='card-title h1 text-center text-monospace'>
          {time}
        </div>
        <div className='text-center mb-3'>
          <ProgressBar
            animated={progressEnd}
            variant={progressVariant}
            now={pct}
          />
        </div>
        <Row className='mr-0 ml-0'>
          <Col sm={6}>
            <Button
              disabled={disabled}
              onClick={(isChronoRunning) ? onStop : onStart}
              variant='outline-primary'
            >
              {(isChronoRunning)
                ? <><Stop /> Detener</>
                : <><Play /> Iniciar</>}
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              disabled={disabled}
              onClick={onDone}
              variant={doneBtnVariation}
            >
              <Check /> Terminar
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
