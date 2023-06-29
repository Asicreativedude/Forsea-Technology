/* eslint-disable react/no-unknown-property */

import { useLayoutEffect, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import PropTypes from 'prop-types';
BioReactor.propTypes = {
	page: PropTypes.number.isRequired,
};
function BioReactor(props) {
	const ref = useRef();
	const cellOuter = useRef();
	const cellInner = useRef();
	const growhtInstances = 20;
	const instances = 100;
	const growthFactor = new THREE.Object3D();
	const cell = new THREE.Object3D();
	const [cellsGroupPosition, setCellsGroupPosition] = useState([25, -5, -100]);

	useEffect(() => {
		if (props.page === 6) {
			setCellsGroupPosition([0, -300, -50]);
		}
	}, [props, cellsGroupPosition]);

	const colors = useMemo(() => {
		let cellColors = ['#61FF00', '#9E00FF', '#FF005C', '#00A3FF'];
		const numInstances = growhtInstances;
		const colorArray = new Array(numInstances * 3).fill(0);
		for (let i = 0; i < numInstances; i++) {
			const color = new THREE.Color(
				cellColors[Math.floor(Math.random() * cellColors.length)]
			);
			color.toArray(colorArray, i * 3);
		}
		return colorArray;
	}, [growhtInstances]);

	useLayoutEffect(() => {
		for (let i = 0; i < growhtInstances; i++) {
			const id = i;
			ref.current.setColorAt(
				id,
				new THREE.Color(colors[id * 3], colors[id * 3 + 1], colors[id * 3 + 2])
			);
		}
		ref.current.instanceMatrix.needsUpdate = true;
	}, [colors, growhtInstances]);

	useFrame(({ clock }, delta) => {
		const time = clock.getElapsedTime();
		if (props.page === 3) {
			for (let i = 0; i < growhtInstances; i++) {
				let newI = i;
				if (i % 2 === 0) {
					newI = growhtInstances + 1;
				}
				const phi = Math.sqrt(newI) * 0.1;
				const theta = time * 0.2 * Math.sqrt(newI);

				const x = 20 * Math.sin(phi) * Math.cos(theta) * 1.5 + newI;
				const y = 20 * Math.cos(phi) * Math.sin(theta) + newI * 1.5;
				const z = 20 * Math.sin(phi) * Math.sin(theta) * -1.5 + newI;
				const id = i;

				growthFactor.position.set(x, y, z);
				growthFactor.rotation.x = time + newI * delta;
				growthFactor.rotation.y = time + newI * delta;
				growthFactor.rotation.z = time + newI * delta;
				growthFactor.updateMatrix();
				ref.current.setMatrixAt(id, growthFactor.matrix);
			}

			for (let i = 0; i < instances; i++) {
				let newI = i;
				if (i % 2 === 0) {
					newI = instances + 1;
				}

				const phi = Math.sqrt(newI) * 0.1;
				const theta = time * 0.2 * Math.sqrt(i);
				const x = 25 * Math.sin(phi) * Math.cos(theta) * -1.5;
				const y = 25 * Math.cos(phi) * Math.sin(theta) + newI;
				const z = 25 * Math.sin(phi) * Math.sin(theta) * -1.5;
				const id = i;
				cell.position.set(x, y, z);
				cell.updateMatrix();
				cellOuter.current.setMatrixAt(id, cell.matrix);
				cellInner.current.setMatrixAt(id, cell.matrix);
			}
		} else if (props.page === 6) {
			const loopDuration = 10; // duration of the loop in seconds
			const scaleDuration = 2; // duration of the scale animation in seconds
			const scaleDelay = 5; // delay before the scale animation starts in seconds
			const fadeInDuration = 1; // duration of the fade-in animation in seconds
			const maxHeight = 10; // maximum height of the fountain
			const startPosition = new THREE.Vector3(40, -10, 0); // starting position for all instances

			for (let i = 0; i < growhtInstances; i++) {
				const t = (i / growhtInstances) * 0.2; // calculate a value between 0 and 1 based on the index
				const loopTime = (time + i * 0.3) % loopDuration; // calculate the current time within the loop, adding a small offset based on the index
				const loopT = loopTime / loopDuration; // calculate a value between 0 and 1 based on the current time within the loop
				const oscillationT = loopT * Math.PI * 2; // create a smooth oscillation between -1 and 1
				const id = i;

				let endPosition;
				if (i % 5 === 0) {
					endPosition = new THREE.Vector3(0, 0, 0);
				} else if (i % 5 === 1) {
					endPosition = new THREE.Vector3(-70, -85, 0);
				} else if (i % 5 === 2) {
					endPosition = new THREE.Vector3(-10, 15, 0);
				} else if (i % 5 === 3) {
					endPosition = new THREE.Vector3(-20, -105, 0);
				} else if (i % 5 === 4) {
					endPosition = new THREE.Vector3(-10, -45, 0);
				}
				const position = new THREE.Vector3().lerpVectors(
					startPosition,
					endPosition,
					t
				); // interpolate between the start and end positions
				position.y += Math.pow(oscillationT, 2) * maxHeight + 1;
				position.x += Math.pow(oscillationT, 2) * -maxHeight + 1; // add the parabolic trajectory to the y position
				growthFactor.position.copy(position);
				growthFactor.rotation.x = time + i * delta;
				growthFactor.rotation.y = time + i * delta;
				growthFactor.rotation.z = time + i * delta;
				const fadeInT = Math.min(loopT * (loopDuration - fadeInDuration), 1); // create a value between 0 and 1 based on the current time within the loop, clamped to 1 after the fade-in duration
				growthFactor.scale.setScalar(fadeInT);
				const scaleT = Math.min(
					Math.max((loopT * (loopDuration - scaleDelay)) / scaleDuration, 0),
					1
				);
				growthFactor.scale.multiplyScalar(1 - scaleT); // set the scale of the instance based on the current time within the loop

				growthFactor.updateMatrix();
				ref.current.setMatrixAt(id, growthFactor.matrix);
			}
		}

		ref.current.instanceMatrix.needsUpdate = true;
		cellOuter.current.instanceMatrix.needsUpdate = true;
		cellInner.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<>
			<group position={cellsGroupPosition}>
				<instancedMesh ref={ref} args={[null, null, growhtInstances]}>
					<coneGeometry args={[0.5, 1, 4]} />
					<meshPhysicalMaterial color={colors} depthWrite={false} wireframe />
				</instancedMesh>
			</group>
			<group position={[20, -10, -70]}>
				<instancedMesh ref={cellOuter} args={[null, null, instances]}>
					<sphereGeometry args={[1, 32, 32]} />
					<MeshTransmissionMaterial
						color='#FFF4EB'
						thickness={0.8}
						transmission={0.99}
						roughness={0.1}
						ior={1.25}
						depthWrite={false}
					/>
				</instancedMesh>
			</group>
			<group position={[20, -10, -70]}>
				<instancedMesh ref={cellInner} args={[null, null, instances]}>
					<sphereGeometry args={[0.4, 8, 8]} />
					<meshPhysicalMaterial color='#666' depthWrite={false} />
				</instancedMesh>
			</group>
		</>
	);
}
export default BioReactor;

//make growth factor  smaller
//make more cells slowly appear
