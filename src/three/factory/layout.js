import * as THREE from 'three'

/** Every section of the page is a station on one aisle, strung along +X. */
export const STATION_X = [0, 20, 40, 60, 80, 100, 120, 142, 164, 186, 208, 230]

export const AISLE_HALF_WIDTH = 5.5
export const BAY_HALF_DEPTH = 10
export const FLOOR_LENGTH = STATION_X[STATION_X.length - 1] + 60

/**
 * One waypoint per station: where the camera sits and what it looks at. Both
 * are splined, so the flight between stations is continuous rather than a
 * series of cuts. Each station's subject sits on the opposite side of the
 * aisle from its caption card.
 */
export const WAYPOINTS = [
  { pos: [-19, 7.6, 15.5], target: [5, 2.6, -1.6] },
  { pos: [10.5, 3.1, 8.2], target: [20.5, 1.9, 2.6] },
  { pos: [31, 2.9, 7.4], target: [40.5, 2.4, -1.2] },
  { pos: [51, 3.2, 7.8], target: [60.5, 2.5, 2.6] },
  { pos: [71, 2.9, 7.2], target: [80.5, 2.6, -1.4] },
  { pos: [91, 2.7, 7.0], target: [100.5, 2.3, 2.4] },
  { pos: [111, 3.6, 8.0], target: [120.5, 2.2, -1.5] },
  { pos: [133, 4.0, 8.6], target: [142.5, 2.6, 2.8] },
  { pos: [155, 3.2, 7.8], target: [164.5, 2.2, -1.8] },
  { pos: [177, 3.8, 8.4], target: [186.5, 2.6, 2.8] },
  { pos: [199, 3.2, 7.6], target: [208.5, 2.4, -1.8] },
  { pos: [221, 2.5, 7.0], target: [230.6, 1.7, 0.2] },
]

const vec = (a) => new THREE.Vector3(...a)

export const CAM_CURVE = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => vec(w.pos)), false, 'catmullrom', 0.25)
export const TARGET_CURVE = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => vec(w.target)), false, 'catmullrom', 0.25)

export const AZURE = '#1b82f0'
export const AZURE_DEEP = '#0d5fc4'
export const CYAN = '#39d0ff'
export const GREEN = '#2fd07a'
export const ALERT = '#ff5c7a'
export const STEEL = '#cfd8e6'

/** Each bay gets its own paint, light and enclosure so they do not blur together. */
export const STATION_STYLE = [
  { id: 'floor', number: '00', label: 'FLOOR', accent: '#1b5fb8', light: '#ffffff' },
  { id: 'intake', number: '01', label: 'INTAKE', accent: '#c9801b', light: '#ffe6bd' },
  { id: 'scan', number: '02', label: 'SCAN', accent: '#1593b8', light: '#cdf0ff' },
  { id: 'solve', number: '03', label: 'SOLVE', accent: '#4b4fc9', light: '#d9dcff' },
  { id: 'assemble', number: '04', label: 'WELD', accent: '#b8431b', light: '#ffd7bd' },
  { id: 'correct', number: '05', label: 'METROLOGY', accent: '#1668dd', light: '#e2efff' },
  { id: 'output', number: '06', label: 'RELEASE', accent: '#0f8a4d', light: '#ccf3dd' },
  { id: 'benefits', number: '07', label: 'GAINS', accent: '#1b5fb8', light: '#ffffff' },
  { id: 'in-action', number: '08', label: 'DEMO BAY', accent: '#1593b8', light: '#e4f6ff' },
  { id: 'products', number: '09', label: 'SOFTWARE', accent: '#4b4fc9', light: '#e6e8ff' },
  { id: 'automate', number: '10', label: 'SHOWCASE', accent: '#c9801b', light: '#ffeccd' },
  { id: 'contact', number: '11', label: 'FRONT DESK', accent: '#0f8a4d', light: '#ffffff' },
]
