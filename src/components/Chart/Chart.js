import React from 'react'
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory'

const COLORS = {
  gray: '#6c757d',
  light: '#dee2e6',
  orange: '#fd7e14'
}
const fontStyle = {
  fontSize: 8,
  padding: 5,
  fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace !important'
}
const yAxisStyle = {
  axis: { stroke: COLORS.gray },
  tickLabels: {
    fill: COLORS.gray,
    ...fontStyle
  }
}
const xAxisStyle = {
  axis: { stroke: COLORS.gray },
  grid: {
    stroke: ({ tick }) => tick > 0 ? COLORS.light : COLORS.gray,
    strokeDasharray: ({ tick }) => tick > 0 ? 8 : 0
  },
  tickLabels: {
    fill: COLORS.gray,
    ...fontStyle
  }
}
const BarStyle = {
  data: {
    fill: COLORS.orange,
    fillOpacity: 0.8,
    strokeWidth: 1
  },
  labels: {
    fill: '#c43a31',
    ...fontStyle
  }
}
const chartPadding = { left: 15, top: 15, bottom: 20, right: 15 }

export default function ChartTime ({ data, xAxis, yAxis, labelKey, minDomain, maxDomain, barWidth }) {
  return (
    <VictoryChart
      padding={chartPadding}
      height={100}
      scale='time'
      minDomain={minDomain}
      maxDomain={maxDomain}
      animate={{
        duration: 900,
        onLoad: { duration: 600 }
      }}
    >
      <VictoryAxis style={yAxisStyle} />
      <VictoryAxis
        dependentAxis
        style={xAxisStyle}
        tickFormat={(x) => (`${x / 1}`)}
      />
      <VictoryBar
        alignment='middle'
        barWidth={barWidth}
        style={BarStyle}
        labels={({ datum }) => datum[labelKey]}
        data={data}
        x={xAxis}
        y={yAxis}
      />
    </VictoryChart>
  )
}
