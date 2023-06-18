/* eslint-disable react/no-unknown-property */
import { useControls } from 'leva';
import { useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';

function Cells(isStemCells, page) {
	const properties = useControls('Organoid', {
		instances: 200,
		radius: 10,
		speed: 0.5,
	});
	const ref = useRef();

	useLayoutEffect(() => {
		if (isStemCells) {
			let i = 0;
			const radius = properties.radius;
			const numInstances = properties.instances;
			for (let j = 0; j < numInstances; j++) {
				const phi = Math.acos(-1 + (2 * j) / numInstances);
				const theta = Math.sqrt(numInstances * Math.PI) * phi;
				const x = radius * Math.sin(phi) * Math.cos(theta);
				const y = radius * Math.cos(phi);
				const z = 0;
				const id = i++;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
			ref.current.instanceMatrix.needsUpdate = true;
		} else {
			let i = 0;
			const radius = properties.radius;
			const numInstances = properties.instances;
			for (let j = 0; j < numInstances; j++) {
				const phi = Math.acos(-1 + (2 * j) / numInstances);
				const theta = Math.sqrt(numInstances * Math.PI) * phi;
				const x = radius * Math.sin(phi) * Math.cos(theta) + (j % 5);
				const y = radius * Math.cos(phi) + (j % 5);
				const z = radius * Math.sin(phi) * Math.sin(theta) + (j % 5);
				const id = i++;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
			ref.current.instanceMatrix.needsUpdate = true;
		}
	}, [properties.instances, properties.radius, isStemCells]);

	// useFrame(({ clock }) => {
	// 	const time = clock.getElapsedTime();
	// 	const radius = properties.radius;
	// 	const numInstances = properties.instances;
	// 	for (let j = 0; j < numInstances; j++) {
	// 		const phi = Math.acos(-1 + (2 * j) / numInstances);
	// 		let theta = Math.sqrt(numInstances * Math.PI) * phi;
	// 		theta += Math.sin(time * properties.speed + j) * 0.1; // Add small, random movement
	// 		const x = radius * Math.sin(phi) * Math.cos(theta) + (j % 5);
	// 		const y = radius * Math.cos(phi) + (j % 5);
	// 		const z = radius * Math.sin(phi) * Math.sin(theta) + (j % 5);
	// 		const id = j;
	// 		const o = new THREE.Object3D();
	// 		o.position.set(x, y, z);
	// 		o.updateMatrix();
	// 		ref.current.setMatrixAt(id, o.matrix);
	// 	}
	// 	ref.current.instanceMatrix.needsUpdate = true;
	// });
	return (
		<group>
			<instancedMesh ref={ref} args={[null, null, properties.instances]}>
				<sphereGeometry args={[1, 64, 64]} />
				<MeshTransmissionMaterial
					color='#ffffff'
					thickness={0.9}
					transmission={0.98}
					roughness={0.1}
					ior={1.25}
					depthWrite={false}
				/>
			</instancedMesh>
		</group>
	);
}
export default Cells;
