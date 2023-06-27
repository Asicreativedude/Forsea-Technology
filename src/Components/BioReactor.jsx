/* eslint-disable react/no-unknown-property */

import { useLayoutEffect, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import PropTypes from 'prop-types';
BioReactor.propTypes = {
	page: PropTypes.number.isRequired,
};
function BioReactor(props) {
	const ref = useRef();
	const [instances, setInstances] = useState(20);
	const [cellsGroupPosition, setCellsGroupPosition] = useState([
		25, -205, -100,
	]);

	useEffect(() => {
		if (props.page === 6) {
			setCellsGroupPosition([0, -300, -50]);
		}
	}, [props, cellsGroupPosition]);

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
		for (let i = 0; i < instances; i++) {
			const id = i;
			const o = new THREE.Object3D();

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
		if (props.page === 3) {
			for (let i = 0; i < instances; i++) {
				let newI = i;
				if (i % 2 === 0) {
					newI = instances + 1;
				}
				const phi = Math.sqrt(newI) * 0.1;
				const theta = time * 0.2 * Math.sqrt(newI);
				const radius = 20;
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
		} else if (props.page === 6) {
			const loopDuration = 10; // duration of the loop in seconds
			const scaleDuration = 2; // duration of the scale animation in seconds
			const scaleDelay = 5; // delay before the scale animation starts in seconds
			const fadeInDuration = 1; // duration of the fade-in animation in seconds
			const maxHeight = 10; // maximum height of the fountain
			const startPosition = new THREE.Vector3(40, -10, 0); // starting position for all instances

			for (let i = 0; i < instances; i++) {
				const t = (i / instances) * 0.2; // calculate a value between 0 and 1 based on the index
				const loopTime = (time + i * 0.3) % loopDuration; // calculate the current time within the loop, adding a small offset based on the index
				const loopT = loopTime / loopDuration; // calculate a value between 0 and 1 based on the current time within the loop
				const oscillationT = loopT * Math.PI * 2; // create a smooth oscillation between -1 and 1
				const id = i;
				const o = new THREE.Object3D();
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
				o.position.copy(position);
				o.rotation.x = time + i * delta;
				o.rotation.y = time + i * delta;
				o.rotation.z = time + i * delta;
				const fadeInT = Math.min(loopT * (loopDuration - fadeInDuration), 1); // create a value between 0 and 1 based on the current time within the loop, clamped to 1 after the fade-in duration
				o.scale.setScalar(fadeInT);
				const scaleT = Math.min(
					Math.max((loopT * (loopDuration - scaleDelay)) / scaleDuration, 0),
					1
				);
				o.scale.multiplyScalar(1 - scaleT); // set the scale of the instance based on the current time within the loop

				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		}

		ref.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<>
			<group position={cellsGroupPosition}>
				<instancedMesh ref={ref} args={[null, null, instances]}>
					<coneGeometry args={[0.5, 1, 4]} />
					<meshPhysicalMaterial color='#999' depthWrite={false} wireframe />
				</instancedMesh>
			</group>
		</>
	);
}
export default BioReactor;

//make growth factor  smaller
//make more cells slowly appear
