/* eslint-disable react/no-unknown-property */

import { useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function BioReactor() {
	const ref = useRef();
	const colors = useMemo(() => {
		let cellColors = ['blue', 'purple', 'green', 'red'];

		const numInstances = 30;
		const colorArray = new Array(numInstances * 3).fill(0);
		for (let i = 0; i < numInstances; i++) {
			const color = new THREE.Color(
				cellColors[Math.floor(Math.random() * cellColors.length)]
			);
			color.toArray(colorArray, i * 3);
		}
		return colorArray;
	}, []);
	useLayoutEffect(() => {
		let i = 0;
		const numInstances = 30;
		const spacing = 10;
		const numRows = Math.ceil(Math.sqrt(numInstances));
		const numCols = Math.ceil(numInstances / numRows);
		for (let row = 0; row < numRows; row++) {
			for (let col = 0; col < numCols; col++) {
				const x = col * spacing - ((numCols - 1) * spacing) / 2;
				const y = row * spacing - ((numRows - 1) * spacing) / 2;
				const z = 0;
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
		}
		ref.current.instanceMatrix.needsUpdate = true;
	}, [colors]);

	// useFrame(({ clock }, delta) => {
	// 	const time = clock.getElapsedTime();
	// 	const numInstances = 20;

	// 	for (let i = 0; i < numInstances; i++) {
	// 		const o = new THREE.Object3D();
	// 		ref.current.getMatrixAt(i, o.matrix);

	// 		o.rotation.x = time + i * delta;
	// 		o.rotation.y = time + i * delta;
	// 		o.rotation.z = time + i * delta;
	// 		o.updateMatrix();
	// 		ref.current.setMatrixAt(i, o.matrix);
	// 	}
	// 	ref.current.instanceMatrix.needsUpdate = true;
	// });
	return (
		<group position={[0, -200, -50]}>
			<instancedMesh ref={ref} args={[null, null, 20]}>
				<coneGeometry args={[1, 2, 4]} />
				{/* <MeshTransmissionMaterial
					color='red'
					thickness={0.9}
					transmission={0.98}
					roughness={0.1}
					ior={1.25}
					depthWrite={false}
				/> */}
				<meshPhysicalMaterial color='#555' depthWrite={false} />
			</instancedMesh>
		</group>
	);
}
export default BioReactor;
