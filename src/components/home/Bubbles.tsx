'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main() {
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`

// Soap-film rim: a fresnel edge whose hue shifts between the brand navy-blue, leaf green and lilac.
const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHue;
varying vec3 vN;
varying vec3 vV;
void main() {
  vec3 n = normalize(vN);
  vec3 v = normalize(vV);
  float f = 1.0 - clamp(dot(n, v), 0.0, 1.0);
  float rim = pow(f, 2.3);
  float t = f * 4.0 + uTime * 0.35 + uHue;
  vec3 c1 = vec3(0.26, 0.50, 0.86);
  vec3 c2 = vec3(0.24, 0.66, 0.26);
  vec3 c3 = vec3(0.58, 0.42, 0.84);
  vec3 col = (c1 * (0.5 + 0.5 * sin(t)) + c2 * (0.5 + 0.5 * sin(t + 2.094)) + c3 * (0.5 + 0.5 * sin(t + 4.188))) / 1.45;
  vec3 L = normalize(vec3(-0.5, 0.7, 0.6));
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 60.0);
  gl_FragColor = vec4(mix(col, vec3(1.0), spec), rim * 0.72 + 0.035 + spec * 0.5);
}`

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Field({ progress, still }: { progress: React.RefObject<number>; still: boolean }) {
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 48, 32), [])
  const bubbles = useMemo(() => {
    const R = rng(11)
    return Array.from({ length: 40 }, () => {
      const s = 0.22 + Math.pow(R(), 2) * 1.7
      return {
        s,
        position: new THREE.Vector3((R() * 1.25 - 0.3) * 15, (R() - 0.5) * 16, -18 + R() * 24),
        speed: 0.15 + R() * 0.45,
        ph: R() * Math.PI * 2,
        f: 0.3 + R() * 0.6,
        material: new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uHue: { value: R() * Math.PI * 2 } },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
        }),
      }
    })
  }, [])
  const meshes = useRef<(THREE.Mesh | null)[]>([])

  useEffect(
    () => () => {
      geometry.dispose()
      bubbles.forEach((b) => b.material.dispose())
    },
    [geometry, bubbles],
  )

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const time = state.clock.elapsedTime
    bubbles.forEach((b, i) => {
      const m = meshes.current[i]
      if (!m) return
      ;(m.material as THREE.ShaderMaterial).uniforms.uTime.value = time
      if (!still) {
        m.position.y += b.speed * dt
        if (m.position.y > 9) m.position.y = -9
        m.position.x += Math.sin(time * b.f + b.ph) * 0.003
      }
      const wob = Math.sin(time * 1.4 + b.ph) * 0.035
      m.scale.set(b.s * (1 + wob), b.s * (1 - wob), b.s)
    })
    // Scrolling the hero flies the camera through the bubbles.
    state.camera.position.z = 14 - (progress.current ?? 0) * 12.5
    state.camera.position.y = (progress.current ?? 0) * 1.4
  })

  return (
    <>
      {bubbles.map((b, i) => (
        <mesh key={i} ref={(el) => void (meshes.current[i] = el)} geometry={geometry} material={b.material} position={b.position} />
      ))}
    </>
  )
}

/** Three.js soap bubbles over the hero. Renders only while the hero is on screen. */
export default function Bubbles({ progress }: { progress: React.RefObject<number> }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  // Client-only component (loaded with ssr: false), so window is available on first render.
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas frameloop={visible ? 'always' : 'never'} dpr={[1, 1.75]} camera={{ position: [0, 0, 14], fov: 42 }} gl={{ alpha: true, antialias: true }}>
        <Field progress={progress} still={still} />
      </Canvas>
    </div>
  )
}
