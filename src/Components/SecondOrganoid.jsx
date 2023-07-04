/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import PropTypes from 'prop-types';
import gsap from 'gsap';

Organoid.propTypes = {
	page: PropTypes.number.isRequired,
};

function Organoid(props) {
	const cell = useRef();
	const cellInner = useRef();
	const masterBank = useRef();
	const cell2 = useRef();
	const cellInner2 = useRef();
	const masterBank2 = useRef();
	const startTime = useRef();
	const radius = useRef(5);
	const instances = useRef(80);
	const cellSize = useRef(0);
	const speed = 0.5;
	const tempObject = new THREE.Object3D();

	// const colors = useMemo(() => {
	// 	// let cellColors = ['#61FF00', '#9E00FF', '#FF005C', '#00A3FF'];
	// 	let cellColors = ['#FFC2D1', '#FFB5A7', '#FB6F92', '#FCD5CE'];
	// 	const numInstances = instances.current;
	// 	const colorArray = new Array(numInstances * 3).fill(0);
	// 	for (let i = 0; i < numInstances; i++) {
	// 		const color = new THREE.Color(
	// 			cellColors[Math.floor(Math.random() * cellColors.length)]
	// 		);
	// 		color.toArray(colorArray, i * 3);
	// 	}
	// 	return colorArray;
	// }, []);

	const colors = useMemo(() => {
		let cellColors = [
			['#FFC2D1', '#FB6F92'],
			['#FFB5A7', '#FCD5CE'],
			['#FFC2D1', '#FB6F92'],
			['#FFB5A7', '#FCD5CE'],
			['#FFC2D1', '#FB6F92'],
			['#FFB5A7', '#FCD5CE'],
		];
		const numInstances = instances.current;
		const colorArray = new Array(numInstances * 3).fill(0);
		let colorIndex = 0;
		for (let i = 0; i < cellColors.length; i++) {
			const groupColors = cellColors[i];
			for (let j = 0; j < groupColors.length; j++) {
				const color = new THREE.Color(groupColors[j]);
				for (
					let k = 0;
					k < numInstances / cellColors.length / groupColors.length;
					k++
				) {
					color.toArray(colorArray, colorIndex);
					colorIndex += 3;
				}
			}
		}
		return colorArray;
	}, []);
	useLayoutEffect(() => {
		let i = 0;
		for (let j = 0; j < instances.current; j++) {
			const id = i++;
			cellInner.current.setColorAt(
				id,
				new THREE.Color(colors[id * 3], colors[id * 3 + 1], colors[id * 3 + 2])
			);
			cellInner2.current.setColorAt(
				id,
				new THREE.Color(colors[id * 3], colors[id * 3 + 1], colors[id * 3 + 2])
			);
		}

		cellInner.current.instanceColor.needsUpdate = true;
		cellInner2.current.instanceColor.needsUpdate = true;
	}, [colors]);

	useFrame(({ clock }) => {
		if (!startTime.current) {
			if (props.page === 7) {
				startTime.current = clock.getElapsedTime();
			}

			masterBank.current.scale.set(0, 0, 0);
			masterBank2.current.scale.set(0, 0, 0);
		} else {
			const time = clock.getElapsedTime() - startTime.current;
			masterBank.current.rotation.y += 0.001;
			masterBank2.current.rotation.y += 0.001;
			if (cellSize.current < 200) {
				for (let i = 0; i < instances.current; i++) {
					cellSize.current = (time * i) / 200;
				}
			}

			for (let j = 0; j < instances.current; j++) {
				const phi = Math.acos(-1 + (2 * j) / instances.current);
				let theta = Math.sqrt(instances.current * Math.PI) * phi;
				theta += Math.sin(time * speed + j) * 0.1; // Add small, random movement
				const x = radius.current * Math.sin(phi) * Math.cos(theta);
				const y = radius.current * Math.cos(phi);
				const z = radius.current * Math.sin(phi) * Math.sin(theta);
				const id = j;
				tempObject.scale.set(1, 1, 1);

				tempObject.position.set(x, y, z);
				tempObject.updateMatrix();
				cell.current.setMatrixAt(id, tempObject.matrix);
				cellInner.current.setMatrixAt(id, tempObject.matrix);
				cell2.current.setMatrixAt(id, tempObject.matrix);
				cellInner2.current.setMatrixAt(id, tempObject.matrix);
			}
		}
		cell.current.instanceMatrix.needsUpdate = true;
		cellInner.current.instanceMatrix.needsUpdate = true;
		cell2.current.instanceMatrix.needsUpdate = true;
		cellInner2.current.instanceMatrix.needsUpdate = true;
	});
	useEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-8',
				start: 'top center',
				end: 'top top',
				scrub: 0.2,
			},
		});
		tl.from(masterBank.current.position, {
			y: 50,
		})
			.from(
				masterBank2.current.position,
				{
					y: 50,
				},
				'<'
			)
			.to(
				masterBank.current.scale,
				{
					x: 1,
					y: 1,
					z: 1,
					duration: 1,
				},
				'<'
			)
			.to(
				masterBank2.current.scale,
				{
					x: 1,
					y: 1,
					z: 1,
					duration: 1,
				},
				'<'
			);
		const organoidExitTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-8',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		organoidExitTl
			.to(cell.current.material, {
				duration: 1,
				opacity: 0,
			})
			.to(
				cellInner.current.material,
				{
					duration: 1,
					opacity: 0,
				},
				'<'
			)
			.to(cell2.current.material, {
				duration: 1,
				opacity: 0,
			})
			.to(
				cellInner2.current.material,
				{
					duration: 1,
					opacity: 0,
				},
				'<'
			);
	}, []);

	return (
		<>
			<group position={[15, 5, -28]} ref={masterBank} visible={props.page > 6}>
				<instancedMesh ref={cell} args={[null, null, instances.current]}>
					<sphereGeometry args={[1, 16, 16]} />
					<MeshTransmissionMaterial
						color='#FFF4EB'
						thickness={0.6}
						transmission={0.96}
						roughness={0.2}
						ior={1.25}
					/>
				</instancedMesh>
				<instancedMesh ref={cellInner} args={[null, null, instances.current]}>
					<sphereGeometry args={[0.5, 8, 8]} />
					<meshPhysicalMaterial color={colors} depthWrite={false} />
				</instancedMesh>
			</group>
			<group position={[8, 3, -30]} ref={masterBank2} visible={props.page > 6}>
				<instancedMesh ref={cell2} args={[null, null, instances.current]}>
					<sphereGeometry args={[1, 16, 16]} />
					<MeshTransmissionMaterial
						color='#FFF4EB'
						thickness={0.6}
						transmission={0.96}
						roughness={0.2}
						ior={1.25}
					/>
				</instancedMesh>
				<instancedMesh ref={cellInner2} args={[null, null, instances.current]}>
					<sphereGeometry args={[0.5, 8, 8]} />
					<meshPhysicalMaterial color={colors} depthWrite={false} />
				</instancedMesh>
			</group>
		</>
	);
}
export default Organoid;
