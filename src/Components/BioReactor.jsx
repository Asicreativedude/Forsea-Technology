/* eslint-disable react/no-unknown-property */

import { useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
// import { useFrame } from '@react-three/fiber';
// import { useHelper, SpotLight } from '@react-three/drei';
// import { SpotLightHelper } from 'three';
function BioReactor() {
	const ref = useRef();
	const colors = useMemo(() => {
		let cellColors = ['blue', 'yellow', 'teal', 'red'];

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
		// const numInstances = 30;
		const spacing = 20;
		const numRows = 6;
		const numCols = 3;
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

	// const light = useRef();
	// console.log(light.current.rotation);
	// useHelper(light, SpotLightHelper, 'cyan');

	return (
		<>
			<group position={[30, -200, -100]}>
				<instancedMesh ref={ref} args={[null, null, 18]}>
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
			{/* <SpotLight
				ref={light}
				position={[0, -199, -3]}
				rotateX={Math.PI * 2}
				distance={5}
				angle={0.55}
				attenuation={5}
				anglePower={10} // Diffuse-cone anglePower (default: 5)
				color={'red'}
			/> */}
		</>
	);
}
export default BioReactor;
