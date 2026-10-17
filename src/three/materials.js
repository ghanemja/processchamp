import * as THREE from 'three'

export const AZURE = '#1b82f0'
export const AZURE_DEEP = '#0d5fc4'
export const AZURE_SOFT = '#4ea7ff'

export const steel = (color = '#c6cbd2', rough = 0.32, metal = 0.95) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })

export const matte = (color = '#1b2028', rough = 0.72) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.25 })

export const emissive = (color = AZURE, intensity = 2.4) =>
  new THREE.MeshStandardMaterial({
    color: '#120a04',
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    roughness: 0.4,
    metalness: 0,
  })
