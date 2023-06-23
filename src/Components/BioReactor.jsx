/* eslint-disable react/no-unknown-property */

import { useLayoutEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function BioReactor() {
	const ref = useRef();
	const [instances, setInstances] = useState(20);

	const colors = useMemo(() => {
		let cellColors = ['#61FF00', '#9E00FF', '#FF005C', '#00A3FF'];

		const numInstances = instances;
		const colorArray = new Array(numInstances * 3).fill(0);
		for (let i = 0; i < numInstances; i++) {
			const color = new THREE.Color(
				cellColors[Math.floor(Math.random() * cellColors.length)]
			);
			color.toArray(colorArray, i * 3);
		}
		return colorArray;
	}, [instances]);

	useLayoutEffect(() => {
		setInstances(20);
		for (let i = 0; i < instances; i++) {
			// const x = (i % 10) * 12 - 60;
			// const y = Math.floor(i / 5) * 20 - 60;
			// const z = 0;
			const id = i;
			const o = new THREE.Object3D();
			// o.position.set(x, y, z);
			o.updateMatrix();

			ref.current.setColorAt(
				id,
				new THREE.Color(colors[id * 3], colors[id * 3 + 1], colors[id * 3 + 2])
			);
		}

		ref.current.instanceMatrix.needsUpdate = true;
	}, [colors, instances]);

	useFrame(({ clock }, delta) => {
		const time = clock.getElapsedTime();
		for (let i = 0; i < instances; i++) {
			let newI = i;
			if (i % 2 === 0) {
				newI = instances + 1;
			}
			const phi = Math.sqrt(newI) * 0.1;
			const theta = time * 0.2 * Math.sqrt(newI);
			const radius = 10;
			const x = radius * Math.sin(phi) * Math.cos(theta) * 1.5 + newI;
			const y = radius * Math.cos(phi) * Math.sin(theta) + newI * 1.5;
			const z = radius * Math.sin(phi) * Math.sin(theta) * -1.5 + newI;
			const id = i;
			const o = new THREE.Object3D();
			o.position.set(x, y, z);
			o.rotation.x = time + newI * delta;
			o.rotation.y = time + newI * delta;
			o.rotation.z = time + newI * delta;
			o.updateMatrix();
			ref.current.setMatrixAt(id, o.matrix);
		}

		ref.current.instanceMatrix.needsUpdate = true;
	});

	// const light = useRef();
	// console.log(light.current.rotation);
	// useHelper(light, SpotLightHelper, 'cyan');

	return (
		<>
			<group position={[25, -205, -100]}>
				<instancedMesh ref={ref} args={[null, null, instances]}>
					<coneGeometry args={[1, 1.5, 4]} />
					{/* <MeshTransmissionMaterial
						color='#fff'
						thickness={0.5}
						transmission={0.2}
						roughness={0.1}
						ior={1.25}
						depthWrite={false}
					/> */}
					<meshPhysicalMaterial color='#999' depthWrite={false} wireframe />
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
