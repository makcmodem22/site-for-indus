import { Suspense, useLayoutEffect, useRef, useMemo, type RefObject } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Box, ContactShadows, Environment, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────── Constants ─────────────── */

/** World units: cabinet top Y; slab is 0.04 tall → center at BASE_TOP + 0.02 */
const BASE_TOP = 0.85
const SLAB_THICK = 0.04
const COUNTERTOP_Y_LANDED = BASE_TOP + SLAB_THICK / 2
const FLOAT_START_Y = 10

/* ─────────────── Dust Particles ─────────────── */

/** Ambient floating dust particles that add atmosphere to the studio scene */
function DustParticles() {
  const count = 120
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = 0.1 + Math.random() * 0.3
      offsets[i] = Math.random() * Math.PI * 2
    }
    return { positions, speeds, offsets }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3] + Math.sin(t * speeds[i] + offsets[i]) * 0.3
      const y = positions[i * 3 + 1] + Math.sin(t * 0.15 + offsets[i]) * 0.5
      const z = positions[i * 3 + 2] + Math.cos(t * speeds[i] + offsets[i]) * 0.3

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(0.006 + Math.sin(t * 0.5 + offsets[i]) * 0.003)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#c9a962" transparent opacity={0.35} />
    </instancedMesh>
  )
}

/* ─────────────── Impact Particles ─────────────── */

/** Burst of particles triggered when the countertop lands on the base */
function ImpactParticles({ triggerRef }: { triggerRef: RefObject<boolean | null> }) {
  const count = 40
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const startTimeRef = useRef<number | null>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const velocities = useMemo(() => {
    const vels = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
      const speed = 0.8 + Math.random() * 1.2
      vels[i * 3] = Math.cos(angle) * speed
      vels[i * 3 + 1] = 0.5 + Math.random() * 1.5
      vels[i * 3 + 2] = Math.sin(angle) * speed
    }
    return vels
  }, [])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return

    // Check for trigger
    if (triggerRef.current && startTimeRef.current === null) {
      startTimeRef.current = clock.getElapsedTime()
      triggerRef.current = false
    }

    if (startTimeRef.current === null) {
      // Hide all particles
      for (let i = 0; i < count; i++) {
        dummy.position.set(0, -100, 0)
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
      return
    }

    const elapsed = clock.getElapsedTime() - startTimeRef.current
    const lifetime = 1.2

    if (elapsed > lifetime) {
      startTimeRef.current = null
      return
    }

    const progress = elapsed / lifetime
    const opacity = 1 - progress

    for (let i = 0; i < count; i++) {
      const vx = velocities[i * 3]
      const vy = velocities[i * 3 + 1]
      const vz = velocities[i * 3 + 2]

      const x = vx * elapsed * 0.5
      const y = COUNTERTOP_Y_LANDED + vy * elapsed * 0.5 - 2.5 * elapsed * elapsed
      const z = vz * elapsed * 0.5

      dummy.position.set(x, Math.max(y, 0.01), z)
      dummy.scale.setScalar(0.012 * opacity)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true

    // Update material opacity
    const mat = mesh.material as THREE.MeshBasicMaterial
    mat.opacity = opacity * 0.7
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#d4c09a" transparent opacity={0} />
    </instancedMesh>
  )
}

/* ─────────────── Kitchen Base ─────────────── */

/**
 * KitchenBase — placeholder cabinet island with multiple drawers and handles.
 *
 * TODO: Replace this <group> with a high-quality GLTF model:
 *   const { scene } = useGLTF('/models/kitchen-base.gltf')
 *   return <primitive object={scene.clone()} />
 */
function KitchenBase() {
  const cabinetMat = (
    <meshStandardMaterial
      color="#151a22"
      metalness={0.45}
      roughness={0.55}
      envMapIntensity={0.85}
    />
  )

  const drawerLineMat = (
    <meshStandardMaterial
      color="#0c0f14"
      metalness={0.6}
      roughness={0.3}
    />
  )

  const handleMat = (
    <meshStandardMaterial
      color="#8c7d65"
      metalness={0.85}
      roughness={0.15}
      envMapIntensity={1.2}
    />
  )

  return (
    <group name="kitchen-base">
      {/* Left cabinet */}
      <Box args={[0.38, 0.85, 0.58]} position={[-0.41, BASE_TOP / 2, 0]} castShadow receiveShadow>
        {cabinetMat}
      </Box>
      {/* Center cabinet */}
      <Box args={[0.42, 0.85, 0.58]} position={[0, BASE_TOP / 2, 0]} castShadow receiveShadow>
        {cabinetMat}
      </Box>
      {/* Right cabinet */}
      <Box args={[0.38, 0.85, 0.58]} position={[0.41, BASE_TOP / 2, 0]} castShadow receiveShadow>
        {cabinetMat}
      </Box>

      {/* Drawer seam lines (subtle visual detail) */}
      {[-0.41, 0, 0.41].map((x, idx) => (
        <group key={`drawer-lines-${idx}`}>
          <Box args={[0.34, 0.005, 0.59]} position={[x, 0.55, 0]} castShadow>
            {drawerLineMat}
          </Box>
          <Box args={[0.34, 0.005, 0.59]} position={[x, 0.28, 0]} castShadow>
            {drawerLineMat}
          </Box>
        </group>
      ))}

      {/* Handles (small metallic bars) */}
      {[-0.41, 0, 0.41].map((x, idx) => (
        <group key={`handles-${idx}`}>
          <Box args={[0.1, 0.012, 0.018]} position={[x, 0.68, 0.3]} castShadow>
            {handleMat}
          </Box>
          <Box args={[0.1, 0.012, 0.018]} position={[x, 0.42, 0.3]} castShadow>
            {handleMat}
          </Box>
          <Box args={[0.1, 0.012, 0.018]} position={[x, 0.14, 0.3]} castShadow>
            {handleMat}
          </Box>
        </group>
      ))}

      {/* Plinth / base kick-plate */}
      <Box args={[1.25, 0.06, 0.55]} position={[0, 0.03, 0.02]} receiveShadow>
        <meshStandardMaterial color="#0a0d12" metalness={0.3} roughness={0.7} />
      </Box>

      {/* TODO: swap boxes for drawer fronts / handles from GLTF */}
    </group>
  )
}

/* ─────────────── Stone Countertop ─────────────── */

type StoneProps = {
  groupRef: RefObject<THREE.Group | null>
}

/**
 * StoneCountertop — placeholder granite slab with edge detail and slight overhang.
 *
 * TODO: Replace <Box> with a high-quality GLTF model:
 *   const { nodes, materials } = useGLTF('/models/granite-slab.gltf')
 *   return <mesh geometry={nodes.Slab.geometry} material={materials.Granite} />
 */
function StoneCountertop({ groupRef }: StoneProps) {
  return (
    <group ref={groupRef} name="stone-countertop">
      {/* Main slab — wider than the base for realistic overhang */}
      <Box args={[1.38, SLAB_THICK, 0.72]} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#2c323c"
          metalness={0.08}
          roughness={0.28}
          envMapIntensity={1.25}
        />
      </Box>
      {/* Polished edge bevel (front) */}
      <Box args={[1.38, 0.008, 0.005]} position={[0, -SLAB_THICK / 2 + 0.004, 0.36]} castShadow>
        <meshStandardMaterial
          color="#3a4250"
          metalness={0.5}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </Box>
      {/* Polished edge bevel (left) */}
      <Box args={[0.005, 0.008, 0.72]} position={[-0.69, -SLAB_THICK / 2 + 0.004, 0]} castShadow>
        <meshStandardMaterial
          color="#3a4250"
          metalness={0.5}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </Box>
      {/* Polished edge bevel (right) */}
      <Box args={[0.005, 0.008, 0.72]} position={[0.69, -SLAB_THICK / 2 + 0.004, 0]} castShadow>
        <meshStandardMaterial
          color="#3a4250"
          metalness={0.5}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </Box>
    </group>
  )
}

/* ─────────────── Responsive Camera ─────────────── */

/** Adjust FOV / framing on narrow viewports */
function ResponsiveCamera() {
  const { camera, size } = useThree()
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.aspect = size.width / Math.max(size.height, 1)
    cam.fov = size.width < 768 ? 48 : 40
    cam.updateProjectionMatrix()
  }, [camera, size.width, size.height])
  return null
}

/* ─────────────── Subtle Camera Orbit ─────────────── */

/** Auto-orbit the camera very slowly when not scrolling for a premium feel */
function CameraAutoOrbit() {
  const { camera } = useThree()
  const basePos = useRef(new THREE.Vector3())
  const initialized = useRef(false)

  useFrame(({ clock }) => {
    if (!initialized.current) {
      basePos.current.copy(camera.position)
      initialized.current = true
    }
    const t = clock.getElapsedTime()
    // Very subtle breathing movement
    camera.position.x = basePos.current.x + Math.sin(t * 0.12) * 0.015
    camera.position.y = basePos.current.y + Math.sin(t * 0.08) * 0.008
    camera.lookAt(0, 0.5, 0)
  })

  return null
}

/* ─────────────── Main Scene Content ─────────────── */

type ScrollSceneProps = {
  scrollContainerRef: RefObject<HTMLElement | null>
}

/**
 * All lights, models, shadows, scroll-driven countertop descent + camera "thud" on landing.
 */
function KitchenSceneContent({ scrollContainerRef }: ScrollSceneProps) {
  const countertopRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const baseCamPos = useRef(new THREE.Vector3())
  const landedRef = useRef(false)
  const impactTriggerRef = useRef<boolean>(false)

  useLayoutEffect(() => {
    const triggerEl = scrollContainerRef.current
    const grp = countertopRef.current
    if (!triggerEl || !grp) return

    baseCamPos.current.copy(camera.position)

    // Start state: countertop high above, slightly rotated
    grp.position.set(0, FLOAT_START_Y, 0)
    grp.rotation.set(0.14, 0.05, 0.09)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress

          // Smooth descent using eased interpolation
          grp.position.y = THREE.MathUtils.lerp(FLOAT_START_Y, COUNTERTOP_Y_LANDED, p)
          grp.rotation.x = THREE.MathUtils.lerp(0.14, 0, p)
          grp.rotation.y = THREE.MathUtils.lerp(0.05, 0, p)
          grp.rotation.z = THREE.MathUtils.lerp(0.09, 0, p)

          // Impact / landing effect
          const landThreshold = 0.94
          if (p >= landThreshold && !landedRef.current) {
            landedRef.current = true

            // Trigger impact particles
            impactTriggerRef.current = true

            // Camera shake "thud" effect
            const bx = baseCamPos.current.x
            const by = baseCamPos.current.y
            const bz = baseCamPos.current.z
            gsap.fromTo(
              camera.position,
              { x: bx, y: by, z: bz },
              {
                x: bx + 0.06,
                y: by - 0.03,
                z: bz - 0.04,
                duration: 0.08,
                yoyo: true,
                repeat: 3,
                ease: 'power3.out',
                onComplete: () => {
                  camera.position.copy(baseCamPos.current)
                },
              }
            )
          }
          if (p < landThreshold - 0.02) {
            landedRef.current = false
          }
        },
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    requestAnimationFrame(refresh)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [scrollContainerRef, camera])

  return (
    <>
      <ResponsiveCamera />
      <CameraAutoOrbit />

      {/* Scene background & atmosphere */}
      <color attach="background" args={['#06080b']} />
      <fog attach="fog" args={['#06080b', 6, 20]} />

      {/* ── Lighting Rig ── */}
      <ambientLight intensity={0.12} color="#8896aa" />

      {/* Main key light */}
      <directionalLight
        position={[-4, 8, 2]}
        intensity={0.4}
        color="#dfe6ee"
      />

      {/* Primary spot — warm highlights on the stone */}
      <spotLight
        position={[5, 7.5, 4]}
        angle={0.45}
        penumbra={0.65}
        intensity={90}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00015}
      />

      {/* Fill light — cool tones from behind */}
      <spotLight
        position={[-3, 5, -3]}
        angle={0.55}
        penumbra={1}
        intensity={30}
        color="#7b8fa8"
      />

      {/* Rim light — subtle edge definition */}
      <spotLight
        position={[0, 4, -5]}
        angle={0.6}
        penumbra={0.8}
        intensity={18}
        color="#a0b0c8"
      />

      {/* Accent light — warm golden from the side */}
      <pointLight
        position={[-4, 2, 2]}
        intensity={8}
        color="#c9a962"
        distance={8}
        decay={2}
      />

      {/* Environment map for realistic reflections */}
      <Environment preset="city" environmentIntensity={0.5} />

      {/* ── 3D Models ── */}
      <KitchenBase />
      <StoneCountertop groupRef={countertopRef} />

      {/* ── Floor with reflections ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          mirror={0.15}
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={0.6}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#080a0e"
          metalness={0.2}
        />
      </mesh>

      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.6}
        scale={14}
        blur={2.5}
        far={5}
        frames={1}
        color="#000000"
      />

      {/* ── Atmospheric particles ── */}
      <DustParticles />
      <ImpactParticles triggerRef={impactTriggerRef} />
    </>
  )
}

/* ─────────────── Exported Canvas ─────────────── */

export type KitchenCanvasProps = {
  scrollContainerRef: RefObject<HTMLElement | null>
}

/**
 * Full-viewport R3F canvas. Parent must provide a ref to the tall scroll driver element.
 */
export function KitchenCanvas({ scrollContainerRef }: KitchenCanvasProps) {
  return (
    <Canvas
      className="!fixed inset-0 z-0 h-[100dvh] w-full touch-none"
      shadows
      dpr={[1, 2]}
      camera={{
        position: [3.1, 2.35, 3.35],
        fov: 40,
        near: 0.1,
        far: 80,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
    >
      <Suspense fallback={null}>
        <KitchenSceneContent scrollContainerRef={scrollContainerRef} />
      </Suspense>
    </Canvas>
  )
}
