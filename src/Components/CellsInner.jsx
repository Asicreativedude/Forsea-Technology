/* eslint-disable react/no-unknown-property */

import { useControls } from 'leva';
import { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CellsInner(isStemCells, page) {
	const properties = useControls('Organoid', {
		instances: 200,
		radius: 25,
		speed: 0.5,
	});

	const ref = useRef();
	const colors = useMemo(() => {
		let cellColors = ['blue', 'purple', 'green', 'red'];

		const numInstances = properties.instances;
		const colorArray = new Array(numInstances * 3).fill(0);
		for (let i = 0; i < numInstances; i++) {
			const color = new THREE.Color(
				cellColors[Math.floor(Math.random() * cellColors.length)]
			);
			color.toArray(colorArray, i * 3);
		}
		return colorArray;
	}, [properties.instances]);

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
				ref.current.instanceMatrix.needsUpdate = true;
			}
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
				ref.current.setColorAt(
					id,
					new THREE.Color(
						colors[id * 3],
						colors[id * 3 + 1],
						colors[id * 3 + 2]
					)
				);
			}
			ref.current.instanceMatrix.needsUpdate = true;
			ref.current.instanceColor.needsUpdate = true;
		}
	}, [properties.instances, properties.radius, colors, isStemCells]);

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
				<sphereGeometry args={[0.4, 64, 64]} />
				<meshPhysicalMaterial color='#555' depthWrite={false} />
			</instancedMesh>
		</group>
	);
}
export default CellsInner;
