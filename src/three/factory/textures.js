import * as THREE from 'three'

const cache = new Map()
const memo = (key, make) => {
  if (!cache.has(key)) cache.set(key, make())
  return cache.get(key)
}

const canvas = (w, h = w) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

const finish = (c, { repeat = 1, srgb = true, aniso = 8 } = {}) => {
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.anisotropy = aniso
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Deterministic value noise so the floor looks the same on every reload. */
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/**
 * Sealed concrete: aggregate speckle, trowel swirls, saw-cut joints and a few
 * stains. Flat colour is what made the floor read as a render.
 */
export function concreteMap({ repeat = 26 } = {}) {
  return memo(`concrete-${repeat}`, () => {
    const [c, g] = canvas(512)
    const r = rng(7)

    g.fillStyle = '#9aa3b0'
    g.fillRect(0, 0, 512, 512)

    // trowel swirl mottling
    for (let i = 0; i < 160; i++) {
      const x = r() * 512
      const y = r() * 512
      const rad = 18 + r() * 60
      const l = 0.5 + r() * 0.5
      const grad = g.createRadialGradient(x, y, 0, x, y, rad)
      grad.addColorStop(0, `rgba(255,255,255,${0.05 * l})`)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grad
      g.beginPath()
      g.arc(x, y, rad, 0, Math.PI * 2)
      g.fill()
    }
    for (let i = 0; i < 120; i++) {
      const x = r() * 512
      const y = r() * 512
      const rad = 20 + r() * 70
      const grad = g.createRadialGradient(x, y, 0, x, y, rad)
      grad.addColorStop(0, `rgba(40,50,62,${0.05 + r() * 0.05})`)
      grad.addColorStop(1, 'rgba(40,50,62,0)')
      g.fillStyle = grad
      g.beginPath()
      g.arc(x, y, rad, 0, Math.PI * 2)
      g.fill()
    }

    // aggregate
    for (let i = 0; i < 5200; i++) {
      const x = r() * 512
      const y = r() * 512
      const s = 0.5 + r() * 1.6
      const dark = r() > 0.45
      g.fillStyle = dark ? `rgba(58,68,80,${0.1 + r() * 0.3})` : `rgba(226,232,240,${0.08 + r() * 0.3})`
      g.fillRect(x, y, s, s)
    }

    // saw-cut control joints
    g.strokeStyle = 'rgba(52,62,74,0.5)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(0, 256)
    g.lineTo(512, 256)
    g.moveTo(256, 0)
    g.lineTo(256, 512)
    g.stroke()
    g.strokeStyle = 'rgba(255,255,255,0.14)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(0, 258)
    g.lineTo(512, 258)
    g.moveTo(258, 0)
    g.lineTo(258, 512)
    g.stroke()

    return finish(c, { repeat })
  })
}

/** Matching roughness variation — wet-looking patches where traffic polishes it. */
export function concreteRough({ repeat = 26 } = {}) {
  return memo(`concrete-rough-${repeat}`, () => {
    const [c, g] = canvas(256)
    const r = rng(19)
    g.fillStyle = '#b4b4b4'
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 90; i++) {
      const x = r() * 256
      const y = r() * 256
      const rad = 14 + r() * 56
      const grad = g.createRadialGradient(x, y, 0, x, y, rad)
      const polished = r() > 0.5
      grad.addColorStop(0, polished ? 'rgba(90,90,90,0.55)' : 'rgba(220,220,220,0.45)')
      grad.addColorStop(1, 'rgba(180,180,180,0)')
      g.fillStyle = grad
      g.beginPath()
      g.arc(x, y, rad, 0, Math.PI * 2)
      g.fill()
    }
    return finish(c, { repeat, srgb: false })
  })
}

/** Diagonal hazard striping for cell thresholds. */
export function hazardMap(a = '#1b5fb8', b = '#eef2f7', { repeat = 1 } = {}) {
  return memo(`hazard-${a}-${b}-${repeat}`, () => {
    const [c, g] = canvas(128, 64)
    g.fillStyle = b
    g.fillRect(0, 0, 128, 64)
    g.fillStyle = a
    g.save()
    g.translate(0, 0)
    for (let x = -64; x < 160; x += 32) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x + 16, 0)
      g.lineTo(x + 16 + 32, 64)
      g.lineTo(x + 32, 64)
      g.closePath()
      g.fill()
    }
    g.restore()
    return finish(c, { repeat })
  })
}

/**
 * Painted floor marking for a cell: outline, corner ticks, big station number
 * and a caption. Gives every station its own identity from the air.
 */
export function cellMarking({ number = '01', label = 'CELL', accent = '#1b5fb8' } = {}) {
  return memo(`marking-${number}-${label}-${accent}`, () => {
    const [c, g] = canvas(512)
    g.clearRect(0, 0, 512, 512)

    g.strokeStyle = accent
    g.globalAlpha = 0.85
    g.lineWidth = 7
    g.strokeRect(34, 34, 444, 444)
    g.globalAlpha = 0.35
    g.lineWidth = 3
    g.strokeRect(50, 50, 412, 412)

    // corner ticks
    g.globalAlpha = 0.9
    g.lineWidth = 9
    const t = 54
    const pts = [
      [34, 34, 1, 1],
      [478, 34, -1, 1],
      [34, 478, 1, -1],
      [478, 478, -1, -1],
    ]
    pts.forEach(([x, y, sx, sy]) => {
      g.beginPath()
      g.moveTo(x + sx * t, y)
      g.lineTo(x, y)
      g.lineTo(x, y + sy * t)
      g.stroke()
    })

    g.globalAlpha = 0.75
    g.fillStyle = accent
    g.font = '700 150px Archivo, Helvetica, Arial, sans-serif'
    g.textAlign = 'center'
    g.fillText(number, 256, 300)
    g.font = '500 40px "IBM Plex Mono", monospace'
    g.globalAlpha = 0.6
    g.fillText(label, 256, 356)

    return finish(c, { repeat: 1 })
  })
}

/** Painted direction arrows for the transfer lane. */
export function arrowMap({ repeat = 1 } = {}) {
  return memo(`arrow-${repeat}`, () => {
    const [c, g] = canvas(128, 256)
    g.clearRect(0, 0, 128, 256)
    g.fillStyle = '#ffffff'
    g.globalAlpha = 0.85
    g.beginPath()
    g.moveTo(64, 30)
    g.lineTo(108, 110)
    g.lineTo(82, 110)
    g.lineTo(82, 210)
    g.lineTo(46, 210)
    g.lineTo(46, 110)
    g.lineTo(20, 110)
    g.closePath()
    g.fill()
    const t = finish(c, { repeat })
    t.repeat.set(1, repeat)
    return t
  })
}

/** Fine brushed grain for machine shells and stand tops. */
export function brushedMap({ repeat = 3 } = {}) {
  return memo(`brushed-${repeat}`, () => {
    const [c, g] = canvas(256)
    const r = rng(41)
    g.fillStyle = '#dfe4ea'
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 2600; i++) {
      const y = r() * 256
      const x = r() * 256
      const len = 8 + r() * 44
      g.strokeStyle = r() > 0.5 ? `rgba(255,255,255,${0.1 + r() * 0.25})` : `rgba(120,132,148,${0.05 + r() * 0.18})`
      g.lineWidth = 0.6 + r() * 0.8
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + len, y)
      g.stroke()
    }
    return finish(c, { repeat })
  })
}

/** Walkway grating / perforated guard mesh. */
export function gratingMap({ repeat = 6 } = {}) {
  return memo(`grating-${repeat}`, () => {
    const [c, g] = canvas(128)
    g.clearRect(0, 0, 128, 128)
    g.strokeStyle = 'rgba(60,72,86,0.9)'
    g.lineWidth = 7
    for (let i = 0; i <= 128; i += 32) {
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i, 128)
      g.stroke()
    }
    g.lineWidth = 3
    for (let i = 0; i <= 128; i += 16) {
      g.beginPath()
      g.moveTo(0, i)
      g.lineTo(128, i)
      g.stroke()
    }
    return finish(c, { repeat })
  })
}

/** Galvanised body-in-white steel: spangle and light directional grain. */
export function galvanisedMap({ repeat = 2 } = {}) {
  return memo(`galv-${repeat}`, () => {
    const [c, g] = canvas(256)
    const r = rng(83)
    g.fillStyle = '#c3ccd8'
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 300; i++) {
      const x = r() * 256
      const y = r() * 256
      const rad = 4 + r() * 16
      g.save()
      g.translate(x, y)
      g.rotate(r() * Math.PI)
      g.fillStyle = r() > 0.5 ? `rgba(255,255,255,${0.1 + r() * 0.16})` : `rgba(130,144,162,${0.08 + r() * 0.14})`
      g.beginPath()
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2
        const rr = rad * (0.55 + r() * 0.6)
        k === 0 ? g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
      g.closePath()
      g.fill()
      g.restore()
    }
    return finish(c, { repeat })
  })
}

/** Painted industrial sheet with faint panel lines and grime at the base. */
export function paintedMap(base = '#b7c1cd', { repeat = 2 } = {}) {
  return memo(`painted-${base}-${repeat}`, () => {
    const [c, g] = canvas(256)
    const r = rng(53)
    g.fillStyle = base
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 60; i++) {
      const x = r() * 256
      const y = r() * 256
      const rad = 10 + r() * 50
      const grad = g.createRadialGradient(x, y, 0, x, y, rad)
      grad.addColorStop(0, `rgba(70,82,96,${0.04 + r() * 0.06})`)
      grad.addColorStop(1, 'rgba(70,82,96,0)')
      g.fillStyle = grad
      g.beginPath()
      g.arc(x, y, rad, 0, Math.PI * 2)
      g.fill()
    }
    g.strokeStyle = 'rgba(70,82,96,0.18)'
    g.lineWidth = 1.5
    for (let i = 64; i < 256; i += 64) {
      g.beginPath()
      g.moveTo(0, i)
      g.lineTo(256, i)
      g.stroke()
    }
    const grime = g.createLinearGradient(0, 200, 0, 256)
    grime.addColorStop(0, 'rgba(50,60,72,0)')
    grime.addColorStop(1, 'rgba(50,60,72,0.22)')
    g.fillStyle = grime
    g.fillRect(0, 200, 256, 56)
    return finish(c, { repeat })
  })
}
