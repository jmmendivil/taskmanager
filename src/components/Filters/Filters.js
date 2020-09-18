import React from 'react'
import { Col, Badge } from 'react-bootstrap'
import { DURATION, DURATION_LABELS } from 'Constants/task.const'

const VARIANTS = {
  SELECTED: 'primary',
  NORMAL: 'light'
}
export default function Filters ({ filters, setFilters }) {
  return (
    <>
      <Col>
        <Badge
          onClick={() => setFilters([filters[0], false])}
          variant={(!filters[1]) ? VARIANTS.SELECTED : VARIANTS.NORMAL}
        >Año
        </Badge>
        <Badge
          onClick={() => setFilters([filters[0], true])}
          variant={(filters[1]) ? VARIANTS.SELECTED : VARIANTS.NORMAL}
        >Semana
        </Badge>
      </Col>
      <Col className='text-right'>
        <Badge
          onClick={() => setFilters([DURATION.SHORT, filters[1]])}
          variant={(filters[0] === DURATION.SHORT) ? VARIANTS.SELECTED : VARIANTS.NORMAL}
        >{DURATION_LABELS.SHORT}
        </Badge>
        <Badge
          onClick={() => setFilters([DURATION.MIDDLE, filters[1]])}
          variant={(filters[0] === DURATION.MIDDLE) ? VARIANTS.SELECTED : VARIANTS.NORMAL}
        >{DURATION_LABELS.MIDDLE}
        </Badge>
        <Badge
          onClick={() => setFilters([DURATION.LARGE, filters[1]])}
          variant={(filters[0] === DURATION.LARGE) ? VARIANTS.SELECTED : VARIANTS.NORMAL}
        >{DURATION_LABELS.LARGE}
        </Badge>
        <Badge
          onClick={() => setFilters([undefined, filters[1]])}
          variant={(typeof filters[0] === 'undefined') ? VARIANTS.SELECTED : VARIANTS.NORMAL}
        >&times;
        </Badge>
      </Col>
    </>
  )
}
