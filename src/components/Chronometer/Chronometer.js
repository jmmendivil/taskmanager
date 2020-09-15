import React from 'react'
import { Row, Col, Button, Card, ProgressBar } from 'react-bootstrap'
import { Play, Stop, Check, ArrowClockwise } from 'react-bootstrap-icons'

export default function Chronometer ({ status, title, time, pct, onStart, onStop, onDone, onReset }) {
  const isChronoRunning = (status === 'started')
  const disabled = (status === 'disabled')
  const doneBtnVariation = (isChronoRunning) ? 'outline-success' : 'success'
  const timerClass = (isChronoRunning) ? '' : 'text-muted'
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
        <div className={timerClass + ' card-title h1 text-center text-monospace'}>
          {time}
        </div>
        <div className='text-center mb-3'>
          <ProgressBar
            animated={progressEnd}
            variant={progressVariant}
            now={pct}
          />
        </div>
        <Row>
          <Col sm={6}>
            <Button
              block
              disabled={disabled}
              onClick={(isChronoRunning) ? onStop : onStart}
            >
              {(isChronoRunning)
                ? <><Stop /> Detener</>
                : <><Play /> Iniciar</>}
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              block
              disabled={disabled || isChronoRunning || pct === 0}
              onClick={onReset}
              variant='outline-primary'
            >
              <ArrowClockwise /> Reiniciar
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              block
              disabled={disabled || pct === 0}
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
