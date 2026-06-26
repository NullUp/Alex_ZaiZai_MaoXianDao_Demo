import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Box3, DoubleSide, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { ENVIRONMENT_SCALE } from '@/game/terrain'
import {
  BUILDING_SCALE_MULTIPLIER,
  GRASS_SCALE_MULTIPLIER,
  ROCK_SCALE_MULTIPLIER,
  TREE_SCALE_MULTIPLIER,
  buildings,
  grassPatches,
  rockDecorations,
  trees,
  type WorldObjectPosition,
} from '@/game/worldObjects'
import buildingsUrl from '../../assets/Buildings.glb?url'
import grassUrl from '../../assets/grass.glb?url'
import rockUrl from '../../assets/stylized_rock_agustin_honnun.glb?url'
import treeSetUrl from '../../assets/low_poly_tree_set.glb?url'

function StylizedBuilding({
  position,
  rotation,
  scale,
  variant,
}: {
  position: WorldObjectPosition
  rotation: number
  scale: number
  variant: 'small' | 'large'
}) {
  const gltf = useGLTF(buildingsUrl)

  const model = useMemo(() => {
    const targetName = variant === 'small' ? 'Stylized_House_Small' : 'Stylized_House_Large'
    const source = gltf.scene.getObjectByName(targetName) ?? gltf.scene.children[0]
    const cloned = source.clone(true)
    const bounds = new Box3().setFromObject(cloned)
    const center = new Vector3()
    bounds.getCenter(center)
    cloned.position.set(-center.x, cloned.position.y - bounds.min.y, -center.z)
    cloned.traverse((child: Object3D) => {
      const mesh = child as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        const fixedMaterials = sourceMaterials.map((material) => {
          const clonedMaterial = material.clone() as MeshStandardMaterial
          clonedMaterial.side = DoubleSide
          clonedMaterial.shadowSide = DoubleSide
          clonedMaterial.transparent = true
          clonedMaterial.depthWrite = true
          clonedMaterial.alphaTest = 0.01
          clonedMaterial.emissiveIntensity = 0.18
          if (clonedMaterial.normalScale) {
            clonedMaterial.normalScale.y = -Math.abs(clonedMaterial.normalScale.y)
          }
          clonedMaterial.needsUpdate = true
          return clonedMaterial
        })
        mesh.material = Array.isArray(mesh.material) ? fixedMaterials : fixedMaterials[0]
      }
    })
    return cloned
  }, [gltf.scene, variant])

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale * BUILDING_SCALE_MULTIPLIER}>
      <primitive object={model} />
    </group>
  )
}

function LowPolyTree({
  position,
  rotation,
  scale,
  modelName,
}: {
  position: WorldObjectPosition
  rotation: number
  scale: number
  modelName: string
}) {
  const gltf = useGLTF(treeSetUrl)

  const model = useMemo(() => {
    const source = gltf.scene.getObjectByName(modelName) ?? gltf.scene.children[0]
    const cloned = source.clone(true)
    const bounds = new Box3().setFromObject(cloned)
    const center = new Vector3()
    bounds.getCenter(center)
    cloned.position.set(-center.x, cloned.position.y - bounds.min.y, -center.z)
    cloned.traverse((child: Object3D) => {
      const mesh = child as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        const fixedMaterials = sourceMaterials.map((material) => {
          const clonedMaterial = material.clone() as MeshStandardMaterial
          clonedMaterial.side = DoubleSide
          clonedMaterial.shadowSide = DoubleSide
          clonedMaterial.roughness = Math.max(clonedMaterial.roughness ?? 0.7, 0.72)
          clonedMaterial.needsUpdate = true
          return clonedMaterial
        })
        mesh.material = Array.isArray(mesh.material) ? fixedMaterials : fixedMaterials[0]
      }
    })
    return cloned
  }, [gltf.scene, modelName])

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale * TREE_SCALE_MULTIPLIER}>
      <primitive object={model} />
    </group>
  )
}

function GroundDecoration({
  assetUrl,
  position,
  rotation,
  scale,
  modelName,
  scaleMultiplier,
}: {
  assetUrl: string
  position: WorldObjectPosition
  rotation: number
  scale: number
  modelName: string
  scaleMultiplier: number
}) {
  const gltf = useGLTF(assetUrl)
  const model = useMemo(() => {
    const source = gltf.scene.getObjectByName(modelName) ?? gltf.scene.children[0]
    const cloned = source.clone(true)
    const bounds = new Box3().setFromObject(cloned)
    const center = new Vector3()
    bounds.getCenter(center)
    cloned.position.set(-center.x, cloned.position.y - bounds.min.y, -center.z)
    cloned.traverse((child: Object3D) => {
      const mesh = child as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        const fixedMaterials = sourceMaterials.map((material) => {
          const clonedMaterial = material.clone() as MeshStandardMaterial
          clonedMaterial.side = DoubleSide
          clonedMaterial.shadowSide = DoubleSide
          clonedMaterial.roughness = Math.max(clonedMaterial.roughness ?? 0.7, 0.76)
          clonedMaterial.needsUpdate = true
          return clonedMaterial
        })
        mesh.material = Array.isArray(mesh.material) ? fixedMaterials : fixedMaterials[0]
      }
    })
    return cloned
  }, [gltf.scene, modelName])

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale * scaleMultiplier}>
      <primitive object={model} />
    </group>
  )
}

export function World() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.22, 0]}>
        <cylinderGeometry args={[30.4, 31.6, 0.42, 72]} />
        <meshStandardMaterial color="#74c476" roughness={0.85} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
        <ringGeometry args={[6.4, 22.4, 64]} />
        <meshStandardMaterial color="#d9a45b" roughness={0.78} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <circleGeometry args={[5.3, 48]} />
        <meshStandardMaterial color="#9fd27b" roughness={0.82} />
      </mesh>

      <group scale={ENVIRONMENT_SCALE}>
        {trees.map((tree) => (
          <LowPolyTree
            key={tree.id}
            position={tree.position}
            rotation={tree.rotation}
            scale={tree.scale}
            modelName={tree.modelName}
          />
        ))}

        {buildings.map((building) => (
          <StylizedBuilding
            key={building.id}
            position={building.position}
            rotation={building.rotation}
            scale={building.scale}
            variant={building.variant}
          />
        ))}

        {grassPatches.map((grass) => (
          <GroundDecoration
            key={grass.id}
            assetUrl={grassUrl}
            position={grass.position}
            rotation={grass.rotation}
            scale={grass.scale}
            modelName={grass.modelName}
            scaleMultiplier={GRASS_SCALE_MULTIPLIER}
          />
        ))}

        {rockDecorations.map((rock) => (
          <GroundDecoration
            key={rock.id}
            assetUrl={rockUrl}
            position={rock.position}
            rotation={rock.rotation}
            scale={rock.scale}
            modelName={rock.modelName}
            scaleMultiplier={ROCK_SCALE_MULTIPLIER}
          />
        ))}
      </group>
    </group>
  )
}

useGLTF.preload(buildingsUrl)
useGLTF.preload(grassUrl)
useGLTF.preload(rockUrl)
useGLTF.preload(treeSetUrl)
