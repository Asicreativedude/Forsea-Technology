/* eslint-disable react/no-unknown-property */

import { useLayoutEffect, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import gsap from 'gsap';
import PropTypes from 'prop-types';

BioReactor.propTypes = {
	page: PropTypes.number.isRequired,
};

function BioReactor(props) {
	const ref = useRef();
	const cellOuter = useRef();
	const cellInner = useRef();
	const bioReactorRef = useRef();
	const cellSize = useRef(0);
	const growhtInstances = 100;
	const instances = 200;
	const growthFactor = new THREE.Object3D();
	const cell = new THREE.Object3D();
	const colors = useMemo(() => {
		const cellColors = [
			['#61FF00', '#9E00FF'],
			['#FF005C', '#00A3FF'],
			['#61FF00', '#9E00FF'],
			['#FF005C', '#00A3FF'],
		];
		const numInstances = growhtInstances;
		const colorArray = new Array(numInstances * 3).fill(0);
		let colorIndex = 0;
		for (let i = 0; i < numInstances; i++) {
			const groupColors = cellColors[i % cellColors.length];
			const color = new THREE.Color(
				groupColors[Math.floor(i / 2) % groupColors.length]
			);
			color.toArray(colorArray, colorIndex);
			colorIndex += 3;
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
		for (let i = 0; i < growhtInstances; i++) {
			let newI = i;
			if (i % 2 === 0) {
				newI = growhtInstances + 1;
			}
			const phi = Math.sqrt(newI) * 0.1;
			const theta = time * 0.2 * Math.sqrt(newI);

			const x = 20 * Math.sin(phi) * Math.cos(theta) * 1.5;
			const y = 20 * Math.cos(phi) * Math.sin(theta) + newI * 1.5;
			const z = 20 * Math.sin(phi) * Math.sin(theta) * -1.5;
			const id = i;

			growthFactor.position.set(x, y, z);
			growthFactor.rotation.x = time + newI * delta;
			growthFactor.rotation.y = time + newI * delta;
			growthFactor.rotation.z = time + newI * delta;
			growthFactor.updateMatrix();
			ref.current.setMatrixAt(id, growthFactor.matrix);
		}
		if (cellSize.current < 200) {
			for (let i = 0; i < instances; i++) {
				cellSize.current = (time * i) / 100;
			}
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
			if (i < 5) {
				cell.scale.set(1, 1, 1);
			} else {
				cell.scale.set(
					Math.min((cellSize.current * i) / 1000, 1),
					Math.min((cellSize.current * i) / 1000, 1),
					Math.min((cellSize.current * i) / 1000, 1)
				);
			}
			cellOuter.current.setMatrixAt(id, cell.matrix);
			cellInner.current.setMatrixAt(id, cell.matrix);
		}

		ref.current.instanceMatrix.needsUpdate = true;
		cellOuter.current.instanceMatrix.needsUpdate = true;
		cellInner.current.instanceMatrix.needsUpdate = true;
	});

	useEffect(() => {
		const bioTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-3',
				start: 'top bottom',
				end: 'top top',
				scrub: 0.2,
			},
		});
		bioTl.from(bioReactorRef.current.position, {
			y: 100,
			duration: 1,
		});

		const bioExitTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-3',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		bioExitTl.to(bioReactorRef.current.position, {
			x: 85,
			duration: 1,
		});
	}, []);

	return (
		<>
			<group
				ref={bioReactorRef}
				position={[0, -10, 0]}
				visible={props.page > 1 && props.page < 5}>
				<group position={[25, -5, -100]}>
					<instancedMesh ref={ref} args={[null, null, growhtInstances]}>
						<coneGeometry args={[0.5, 1, 4]} />
						<meshBasicMaterial color={colors} wireframe />
					</instancedMesh>
				</group>
				<group position={[20, -10, -70]}>
					<instancedMesh ref={cellOuter} args={[null, null, instances]}>
						<sphereGeometry args={[1, 8, 8]} />
						<MeshTransmissionMaterial
							color='#FFF4EB'
							thickness={0.8}
							transmission={0.96}
							roughness={0.2}
							ior={1.25}
						/>
					</instancedMesh>
				</group>
				<group position={[20, -10, -70]}>
					<instancedMesh ref={cellInner} args={[null, null, instances]}>
						<sphereGeometry args={[0.4, 8, 8]} />
						<meshPhysicalMaterial color='#eee' />
					</instancedMesh>
				</group>
			</group>
		</>
	);
}
export default BioReactor;

//make growth factor  smaller
//make more cells slowly appear
