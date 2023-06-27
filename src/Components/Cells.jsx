/* eslint-disable react/no-unknown-property */
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import PropTypes from 'prop-types';

Cells.propTypes = {
	isStemCells: PropTypes.bool.isRequired,
	page: PropTypes.number.isRequired,
	progress: PropTypes.number.isRequired,
};
function Cells(props) {
	const ref = useRef();
	const startTime = useRef();
	const masterBank = useRef();
	const [radius, setRadius] = useState(25);
	const instances = 200;
	const speed = 0.5;
	const [cellsGroupPosition, setCellsGroupPosition] = useState([0, -100, 0]);
	const cellSize = useRef(0);
	useEffect(() => {
		if (props.page === 2) {
			setCellsGroupPosition([20, -110, -25]);
		} else if (props.page === 3) {
			setCellsGroupPosition([20, -210, -70]);
		} else if (props.page === 4) {
			setCellsGroupPosition([5, -300, -15]);
		} else if (props.page === 5) {
			setCellsGroupPosition([20, -300, -50]);
			setRadius(15);
		} else if (props.page === 6) {
			setCellsGroupPosition([30, -310, -50]);
		}
	}, [props, cellsGroupPosition]);

	useLayoutEffect(() => {
		if (props.page === 2) {
			const radii = [5, 8, 11, 14, 17, 20, 23];
			let i = 0;
			let radiusIndex = 0;
			let instancesLeft = instances;
			while (instancesLeft > 0) {
				let instancesPerRadius = Math.ceil(
					instancesLeft / (radii.length - radiusIndex) / 2
				);
				if (radiusIndex === 0) instancesPerRadius = 10;
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
					if (radiusIndex === 0) o.scale.set(1, 1, 1);
					else
						o.scale.set(
							Math.min((cellSize.current * j) / 50, 1),
							Math.min((cellSize.current * j) / 50, 1),
							Math.min((cellSize.current * j) / 50, 1)
						);
					o.updateMatrix();
					ref.current.setMatrixAt(id, o.matrix);
					instancesLeft--;
				}
				radiusIndex++;
			}
			ref.current.instanceMatrix.needsUpdate = true;
		} else if (props.page === 3) {
			for (let i = 0; i < instances; i++) {
				const x = (i % 5) * 5 - 25;
				const y = Math.floor(i / 10) * 10 - 25;
				const z = 0;
				const id = i;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		} else {
			let i = 0;
			for (let j = 0; j < instances; j++) {
				const phi = Math.acos(-1 + (2 * j) / instances);
				const theta = Math.sqrt(instances * Math.PI) * phi;
				const x = radius * Math.sin(phi) * Math.cos(theta) + 0.1;
				const y = radius * Math.cos(phi) + 0.1;
				const z = radius * Math.sin(phi) * Math.sin(theta) + 0.1;
				const id = i++;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
			ref.current.instanceMatrix.needsUpdate = true;
		}
	}, [instances, radius, props.page, cellSize.current]);

	useFrame(({ clock }) => {
		if (!startTime.current) {
			startTime.current = clock.getElapsedTime();
		}
		if (props.page === 2) {
			const time = clock.getElapsedTime() - startTime.current;
			if (cellSize.current < 200) {
				for (let i = 0; i < instances; i++) {
					cellSize.current = (time * i) / 100;
				}
			}
			if (
				masterBank.current.position.z > -40 &&
				masterBank.current.position.x < 30
			) {
				masterBank.current.position.z += time * -0.001;
				masterBank.current.position.x += time * 0.001;
			}
			masterBank.current.rotation.z = time * 0.05;
		} else if (props.page === 3) {
			const time = clock.getElapsedTime();
			masterBank.current.rotation.z = 0;

			for (let i = 0; i < instances; i++) {
				let newI = i;
				if (i % 2 === 0) {
					newI = instances + 1;
				}
				const phi = Math.sqrt(newI) * 0.1;
				const theta = time * 0.2 * Math.sqrt(i);
				const radius = 25;
				const x = radius * Math.sin(phi) * Math.cos(theta) * -1.5;
				const y = radius * Math.cos(phi) * Math.sin(theta) + newI;
				const z = radius * Math.sin(phi) * Math.sin(theta) * -1.5;
				const id = i;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		} else if (props.page >= 4) {
			const time = clock.getElapsedTime();
			masterBank.current.rotation.y += 0.001;
			for (let j = 0; j < instances; j++) {
				const phi = Math.acos(-1 + (2 * j) / instances);
				let theta = Math.sqrt(instances * Math.PI) * phi;
				theta += Math.sin(time * speed + j) * 0.1; // Add small, random movement
				const x = radius * Math.sin(phi) * Math.cos(theta);
				const y = radius * Math.cos(phi);
				const z = radius * Math.sin(phi) * Math.sin(theta);
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
		<group position={cellsGroupPosition} ref={masterBank}>
			<instancedMesh ref={ref} args={[null, null, instances]}>
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
	);
}
export default Cells;
