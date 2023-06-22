/* eslint-disable react/no-unknown-property */

import { useRef, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';

CellsInner.propTypes = {
	isStemCells: PropTypes.bool.isRequired,
	page: PropTypes.number.isRequired,
};

function CellsInner(props) {
	const radius = 25;
	const instances = 200;
	const speed = 0.5;
	const [cellsGroupPosition, setCellsGroupPosition] = useState([0, -100, 0]);

	useEffect(() => {
		if (props.page === 2) {
			setCellsGroupPosition([30, -100, -50]);
		} else if (props.page === 4) {
			setCellsGroupPosition([5, -295, -70]);
		} else if (props.page === 5) {
			setCellsGroupPosition([5, -315, -150]);
		}
	}, [props]);

	function getHeight(x, z, time) {
		const a = 5; // controls the amplitude of the wave
		const b = 1; // controls the wavelength of the wave
		const c = time; // controls the phase of the wave
		const d = 0; // controls the vertical offset of the wave
		const height = a * Math.sin((2 * Math.PI * x) / b + c) + d;
		return height;
	}
	const ref = useRef();
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
		if (props.page === 2) {
			const radii = [5, 10, 15, 20, 25, 30];
			let i = 0;
			const numInstances = instances;
			let radiusIndex = 0;
			let instancesLeft = numInstances;
			while (instancesLeft > 0) {
				const instancesPerRadius = Math.ceil(
					instancesLeft / (radii.length - radiusIndex) / 5
				);
				const angleIncrement = (2 * Math.PI) / instancesPerRadius;
				const currentRadius = radii[radiusIndex];
				for (let j = 0; j < instancesPerRadius && instancesLeft > 0; j++) {
					const angle = j * angleIncrement + Math.PI / instancesPerRadius;
					const x = currentRadius * Math.cos(angle);
					const y = currentRadius * Math.sin(angle);
					const z = 0;
					const id = i++;
					const o = new THREE.Object3D();
					o.position.set(x, y, z);
					o.updateMatrix();
					ref.current.setMatrixAt(id, o.matrix);
					instancesLeft--;
				}
				radiusIndex++;
			}
			ref.current.instanceMatrix.needsUpdate = true;
		} else if (props.page === 4) {
			for (let i = 0; i < instances; i++) {
				const x = (i % 10) * 12 - 60;
				const y = Math.floor(i / 10) * 12 - 60;
				const z = 0;
				const id = i;
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
		} else if (props.page === 6) {
			let i = 0;
			const numInstances = instances;
			for (let j = 0; j < numInstances; j++) {
				const phi = Math.acos(-1 + (2 * j) / numInstances);
				const theta = Math.sqrt(numInstances * Math.PI) * phi;
				const x = radius * Math.sin(phi) * Math.cos(theta);
				const y = radius * Math.cos(phi);
				const z = radius * Math.sin(phi) * Math.sin(theta);
				const id = i++;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
			ref.current.instanceMatrix.needsUpdate = true;
			ref.current.instanceColor.needsUpdate = true;
		}
	}, [radius, instances, colors, props.page]);
	useFrame(({ clock }) => {
		const time = clock.getElapsedTime();
		let numInstances = instances;
		if (props.page === 4) {
			for (let i = 0; i < instances; i++) {
				const x = (i % 10) * 12 - 60 + Math.sin(time * speed + i) * 0.5;
				const y =
					Math.floor(i / 10) * 12 - 60 + Math.cos(time * speed + i) * 0.5;
				const z = 0;
				const id = i;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		} else if (props.page === 5) {
			for (let i = 0; i < instances; i++) {
				const x = (i % 10) * 20 - 100;
				const z = Math.floor(i / 10) * 12 - 60;
				const y = getHeight(z, x, time + i * 0.05);
				const id = i;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		} else if (props.page === 6) {
			for (let j = 0; j < numInstances; j++) {
				const phi = Math.acos(-1 + (2 * j) / numInstances);
				let theta = Math.sqrt(numInstances * Math.PI) * phi;
				theta += Math.sin(time * speed + j + 0.05) * 0.1; // Add small, random movement
				const x = radius * Math.sin(phi) * Math.cos(theta) + 0.05;
				const y = radius * Math.cos(phi) + 0.05;
				const z = radius * Math.sin(phi) * Math.sin(theta) + 0.05;
				const id = j;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		}
		ref.current.instanceMatrix.needsUpdate = true;
	});
	return (
		<group position={cellsGroupPosition}>
			<instancedMesh ref={ref} args={[null, null, instances]}>
				<sphereGeometry args={[0.4, 8, 8]} />
				<meshPhysicalMaterial color='#555' depthWrite={false} />
			</instancedMesh>
		</group>
	);
}
export default CellsInner;
