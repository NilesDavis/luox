import {calculateLuminance, calculateAlphaOpic, calculateChromaticity31, calculateChromaticity64} from './rows.js'
import {createTableHeader, createTableRow} from './table.js'
import {asDecimal, sampleTitles} from './helpers.js'

const createCalculationTableHeader = (table, sampleCount) => {
  const titles = ["Condition", ...sampleTitles(sampleCount)]
  createTableHeader(table, titles)
}

export const createCalculationTable = (table, radianceOrIrradiance, rows, sampleCount, simplifiedReport) => {
  createCalculationTableHeader(table, sampleCount)

  let units = ''
  if (radianceOrIrradiance === 'radiance') {
    units = 'mW ⋅ m⁻² ⋅ sr'
  } else {
    units = 'mW ⋅ m⁻²'
  }

  const luminanceTotals = calculateLuminance(rows, sampleCount)
  const chromaticity31  = calculateChromaticity31(rows, sampleCount)
  const chromaticity31XValues = chromaticity31.map((c) => c.x)
  const chromaticity31YValues = chromaticity31.map((c) => c.y)
  const chromaticity64  = calculateChromaticity64(rows, sampleCount)
  const chromaticity64XValues = chromaticity64.map((c) => c.x)
  const chromaticity64YValues = chromaticity64.map((c) => c.y)
  const sConeTotals = calculateAlphaOpic(rows, sampleCount, 'sCone')
  const mConeTotals = calculateAlphaOpic(rows, sampleCount, 'mCone')
  const lConeTotals = calculateAlphaOpic(rows, sampleCount, 'lCone')
  const rodTotals = calculateAlphaOpic(rows, sampleCount, 'rod')
  const melTotals = calculateAlphaOpic(rows, sampleCount, 'mel')
  if (radianceOrIrradiance === 'radiance') {
    createTableRow(table, "Luminance [cd/m²]", luminanceTotals, asDecimal)
  } else {
    createTableRow(table, "Illuminance [lux]", luminanceTotals, asDecimal)
  }
  if (!simplifiedReport) {
    createTableRow(table, "CIE 1931 xy chromaticity (x)", chromaticity31XValues, asDecimal)
    createTableRow(table, "CIE 1931 xy chromaticity (y)", chromaticity31YValues, asDecimal)
    createTableRow(table, "CIE 1964 x₁₀y₁₀ chromaticity (x₁₀)", chromaticity64XValues, asDecimal)
    createTableRow(table, "CIE 1964 x₁₀y₁₀ chromaticity (y₁₀)", chromaticity64YValues, asDecimal)
  }
  createTableRow(table, `S-cone-opic ${radianceOrIrradiance} (${units})`, sConeTotals, asDecimal)
  createTableRow(table, `M-cone-opic ${radianceOrIrradiance} (${units})`, mConeTotals, asDecimal)
  createTableRow(table, `L-cone-opic ${radianceOrIrradiance} (${units})`, lConeTotals, asDecimal)
  createTableRow(table, `Rhodopic ${radianceOrIrradiance} (${units})`, rodTotals, asDecimal)
  createTableRow(table, `Melanopic ${radianceOrIrradiance} (${units})`, melTotals, asDecimal)
}
