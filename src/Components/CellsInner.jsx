/* eslint-disable react/no-unknown-property */

import { useRef, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import gsap from 'gsap';

CellsInner.propTypes = {
	isStemCells: PropTypes.bool.isRequired,
	page: PropTypes.number.isRequired,
};

function CellsInner(props) {
	const ref = useRef();
	const masterBank = useRef();
	const startTime = useRef();
	const radius = useRef(25);
	const instances = useRef(200);
	const speed = 0.5;
	const [cellsGroupPosition, setCellsGroupPosition] = useState([0, -100, 0]);
	const cellSize = useRef(0);

	useEffect(() => {
		if (props.page === 2) {
			setCellsGroupPosition([20, -110, -25]);
		} else if (props.page === 3) {
			setCellsGroupPosition([20, -210, -70]);
			instances.current = 100;
		} else if (props.page === 4) {
			setCellsGroupPosition([5, -300, -15]);
		}
	}, [props, cellsGroupPosition]);

	const colors = useMemo(() => {
		// let cellColors = ['#61FF00', '#9E00FF', '#FF005C', '#00A3FF'];
		let cellColors = ['#FFC2D1', '#FFB5A7', '#FB6F92', '#FCD5CE'];

		const numInstances = instances.current;
		const colorArray = new Array(numInstances * 3).fill(0);
		for (let i = 0; i < numInstances; i++) {
			const color = new THREE.Color(
				cellColors[Math.floor(Math.random() * cellColors.length)]
			);
			color.toArray(colorArray, i * 3);
		}
		return colorArray;
	}, [instances.current]);
	useLayoutEffect(() => {
		if (props.page === 2) {
			const radii = [5, 8, 11, 14, 17, 20, 23];
			let i = 0;
			let radiusIndex = 0;
			let instancesLeft = instances.current;
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
			for (let i = 0; i < instances.current; i++) {
				const x = (i % 5) * 5 - 25;
				const y = Math.floor(i / 10) * 10 - 25;
				const z = 0;
				const id = i;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		} else if (props.page === 4) {
			let i = 0;
			for (let j = 0; j < instances.current; j++) {
				const phi = Math.acos(-1 + (2 * j) / instances.current);
				const theta = Math.sqrt(instances.current * Math.PI) * phi;
				const x = radius.current * Math.sin(phi) * Math.cos(theta);
				const y = radius.current * Math.cos(phi);
				const z = radius.current * Math.sin(phi) * Math.sin(theta);
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
	}, [radius.current, instances.current, colors, props.page, cellSize.current]);

	useFrame(({ clock }) => {
		if (!startTime.current) {
			startTime.current = clock.getElapsedTime();
		}
		if (props.page === 2) {
			const time = clock.getElapsedTime() - startTime.current;
			if (cellSize.current < 200) {
				for (let i = 0; i < instances.current; i++) {
					cellSize.current = ((time * i) / 100) * 0.8;
				}
			}
			if (
				masterBank.current.position.z > -40 &&
				masterBank.current.position.x < 30
			) {
				masterBank.current.position.z += time * -0.001;
				masterBank.current.position.x += time * 0.001;
			}
			masterBank.current.rotation.z = time * -0.05;
		} else if (props.page === 3) {
			const time = clock.getElapsedTime();
			masterBank.current.rotation.z = 0;

			for (let i = 0; i < instances.current; i++) {
				let newI = i;
				if (i % 2 === 0) {
					newI = instances.current + 1;
				}
				const phi = Math.sqrt(newI) * 0.1;
				const theta = time * 0.2 * Math.sqrt(i);

				const x = radius.current * Math.sin(phi) * Math.cos(theta) * -1.5;
				const y = radius.current * Math.cos(phi) * Math.sin(theta) + newI;
				const z = radius.current * Math.sin(phi) * Math.sin(theta) * -1.5;
				const id = i;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		} else if (props.page >= 4) {
			const time = clock.getElapsedTime();
			masterBank.current.rotation.y += 0.001;
			for (let j = 0; j < instances.current; j++) {
				const phi = Math.acos(-1 + (2 * j) / instances.current);
				let theta = Math.sqrt(instances.current * Math.PI) * phi;
				theta += Math.sin(time * speed + j + 0.05) * 0.1; // Add small, random movement
				const x = radius.current * Math.sin(phi) * Math.cos(theta) + 0.05;
				const y = radius.current * Math.cos(phi) + 0.05;
				const z = radius.current * Math.sin(phi) * Math.sin(theta) + 0.05;
				const id = j;
				const o = new THREE.Object3D();
				o.position.set(x, y, z);
				o.updateMatrix();
				ref.current.setMatrixAt(id, o.matrix);
			}
		}
		ref.current.instanceMatrix.needsUpdate = true;
	});
	useEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-2',
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		});
		tl.to(masterBank.current.position, {
			duration: 1,
			x: 50,
		});
		const tl3 = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-4',
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		});
		tl3
			.to(masterBank.current.position, {
				duration: 1,
				z: -50,
				x: 20,
			})
			.to(
				radius,
				{
					duration: 1,
					current: 15,
				},
				'<'
			);

		const tl4 = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-5',
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		});
		tl4.to(masterBank.current.position, {
			duration: 1,
			y: -310,
			x: 30,
		});
	}, []);

	return (
		<group position={cellsGroupPosition} ref={masterBank}>
			<instancedMesh ref={ref} args={[null, null, instances.current]}>
				<sphereGeometry args={[0.4, 8, 8]} />
				<meshPhysicalMaterial color='#666' depthWrite={false} />
			</instancedMesh>
		</group>
	);
}
export default CellsInner;
