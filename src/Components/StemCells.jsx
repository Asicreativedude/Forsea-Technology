/* eslint-disable react/no-unknown-property */

import { MeshTransmissionMaterial, Float } from '@react-three/drei';
function StemCells() {
	return (
		<>
			<Float
				speed={1}
				rotationIntensity={0}
				floatIntensity={1}
				floatingRange={[-0.5, 0.5]}>
				<group position={[1, 0, -8]}>
					<mesh>
						<sphereGeometry args={[1, 64, 64]} />
						<MeshTransmissionMaterial
							color='#ffffff'
							thickness={0.5}
							transmission={0.98}
							roughness={0.6}
							ior={1.25}
							depthWrite={false}
						/>
					</mesh>
					<mesh>
						<sphereGeometry args={[0.4, 64, 64]} />
						<meshPhysicalMaterial color='#555' depthWrite={false} />
					</mesh>
				</group>
			</Float>
			<Float
				speed={1}
				rotationIntensity={0}
				floatIntensity={1}
				floatingRange={[-0.5, 0.5]}>
				<group position={[3, 0, -6]}>
					<mesh>
						<sphereGeometry args={[1, 64, 64]} />
						<MeshTransmissionMaterial
							color='#ffffff'
							thickness={0.5}
							transmission={0.98}
							roughness={0.6}
							ior={1.25}
							depthWrite={false}
						/>
					</mesh>
					<mesh>
						<sphereGeometry args={[0.4, 64, 64]} />
						<meshPhysicalMaterial color='#555' depthWrite={false} />
					</mesh>
				</group>
			</Float>
		</>
	);
}
export default StemCells;
