export type SpotPos = { x: number; y: number }

// Default approximate positions (percent) for finger centers per hand.
// Edit these numbers to calibrate spots to your images.
export const left: SpotPos[] = [
  { x: 6, y: 48 },
  { x: 46, y: 10 },
  { x: 63, y: 3 },
  { x: 82, y: 13 },
  { x: 95, y: 24 },
]

export const right: SpotPos[] = [
  { x: 94, y: 48 },
  { x: 54, y: 10 },
  { x: 37, y: 3 },
  { x: 18, y: 13 },
  { x: 5, y: 24 },
]

export default { left, right }
