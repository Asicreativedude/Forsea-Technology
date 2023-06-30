/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import PropTypes from 'prop-types';
import gsap from 'gsap';

Cells.propTypes = {
	page: PropTypes.number.isRequired,
};
function Cells(props) {
	const cell = useRef();
	const cellInner = useRef();
	const startTime = useRef(null);
	const masterBank = useRef();
	const radius = useRef(25);
	const instances = useRef(200);
	const cellSize = useRef(0);
	const speed = 0.5;
	const tempObject = new THREE.Object3D();
	const radii = [5, 8, 11, 14, 17, 20, 23];
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
	}, []);

	useLayoutEffect(() => {
		if (props.page >= 3) {
			let i = 0;
			for (let j = 0; j < instances.current; j++) {
				const id = i++;
				cellInner.current.setColorAt(
					id,
					new THREE.Color(
						colors[id * 3],
						colors[id * 3 + 1],
						colors[id * 3 + 2]
					)
				);
			}

			cellInner.current.instanceColor.needsUpdate = true;
			if (props.page === 3) {
				gsap.set(masterBank.current.position, {
					x: -20,
					y: 30,
					z: 0,
				});
			}
		}
	}, [props.page, colors]);

	useFrame(({ clock }) => {
		if (!startTime.current) {
			if (props.page === 2) {
				startTime.current = clock.getElapsedTime();
			} else {
				let i = 0;
				const angleIncrement = (2 * Math.PI) / 10;
				const currentRadius = 5;
				for (let j = 0; j <= 10; j++) {
					const angle = j * angleIncrement + Math.PI / 10;
					tempObject.position.set(
						currentRadius * Math.cos(angle),
						currentRadius * Math.sin(angle),
						0
					);
					const id = i++;
					tempObject.scale.set(1, 1, 1);
					tempObject.updateMatrix();
					cell.current.setMatrixAt(id, tempObject.matrix);
					cellInner.current.setMatrixAt(id, tempObject.matrix);
				}
				cell.current.instanceMatrix.needsUpdate = true;
				cellInner.current.instanceMatrix.needsUpdate = true;
				return;
			}
		} else if (startTime.current && props.page === 2) {
			const time = clock.getElapsedTime() - startTime.current;
			masterBank.current.rotation.z = time * -0.05;
			let i = 0;
			let radiusIndex = 0;
			let instancesLeft = instances.current;
			if (cellSize.current < 200) {
				for (let i = 0; i < instances.current; i++) {
					cellSize.current = (time * i) / 100;
				}
			}

			while (instancesLeft > 0) {
				let instancesPerRadius = Math.ceil(
					instancesLeft / (radii.length - radiusIndex) / 2
				);
				if (radiusIndex === 0) instancesPerRadius = 10;

				const angleIncrement = (2 * Math.PI) / instancesPerRadius;
				const currentRadius = radii[radiusIndex];
				for (let j = 0; j < instancesPerRadius && instancesLeft > 0; j++) {
					const angle = j * angleIncrement + Math.PI / instancesPerRadius;
					tempObject.position.set(
						currentRadius * Math.cos(angle),
						currentRadius * Math.sin(angle),
						0
					);
					const id = i++;
					if (radiusIndex === 0) {
						tempObject.scale.set(1, 1, 1);
					} else {
						if (startTime.current) {
							tempObject.scale.set(
								Math.min((cellSize.current * j) / 50, 1),
								Math.min((cellSize.current * j) / 50, 1),
								Math.min((cellSize.current * j) / 50, 1)
							);
						}
					}

					tempObject.updateMatrix();
					cell.current.setMatrixAt(id, tempObject.matrix);
					cellInner.current.setMatrixAt(id, tempObject.matrix);
					instancesLeft--;
				}
				radiusIndex++;
			}
		} else if (props.page >= 3) {
			const time = clock.getElapsedTime();
			masterBank.current.rotation.y += 0.001;
			for (let j = 0; j < instances.current; j++) {
				const phi = Math.acos(-1 + (2 * j) / instances.current);
				let theta = Math.sqrt(instances.current * Math.PI) * phi;
				theta += Math.sin(time * speed + j) * 0.1; // Add small, random movement
				const x = radius.current * Math.sin(phi) * Math.cos(theta);
				const y = radius.current * Math.cos(phi);
				const z = radius.current * Math.sin(phi) * Math.sin(theta);
				const id = j;
				tempObject.position.set(x, y, z);
				tempObject.updateMatrix();
				cell.current.setMatrixAt(id, tempObject.matrix);
				cellInner.current.setMatrixAt(id, tempObject.matrix);
			}
		}
		cell.current.instanceMatrix.needsUpdate = true;
		cellInner.current.instanceMatrix.needsUpdate = true;
	});

	const camera = useThree((state) => state.camera);

	useEffect(() => {
		const initialTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-2',
				start: 'top bottom',
				end: 'top top',
				scrub: 0.2,
			},
		});
		initialTl.from(masterBank.current.position, {
			duration: 1,
			y: -25,
		});

		const cellBankTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-2',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		cellBankTl.to(
			camera.position,
			{
				duration: 1,
				x: -15,
			},
			'<'
		);
		const organoidInsideTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-4',
				start: 'top bottom',
				end: 'top top',
				scrub: 0.2,
			},
		});
		organoidInsideTl.to(masterBank.current.position, {
			duration: 1,
			x: -15,
			z: 0,
			y: 0,
		});

		const organoidTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-4',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});

		organoidTl
			.to(masterBank.current.position, {
				duration: 1,
				z: -35,
				x: 2,
			})
			.to(
				radius,
				{
					duration: 1,
					current: 15,
				},
				'<'
			);

		const organoidMoveTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-5',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		organoidMoveTl.to(masterBank.current.position, {
			duration: 1,
			x: 16,
			y: -13,
		});
	}, [camera]);
	return (
		<>
			<group position={[28, -13, -30]} ref={masterBank}>
				<group>
					<instancedMesh ref={cell} args={[null, null, instances.current]}>
						<sphereGeometry args={[1, 32, 32]} />
						<MeshTransmissionMaterial
							color='#FFF4EB'
							thickness={0.8}
							transmission={0.99}
							roughness={0.1}
							ior={1.25}
							depthWrite={false}
							depthTest={false}
						/>
					</instancedMesh>
				</group>
				<group>
					<instancedMesh ref={cellInner} args={[null, null, instances.current]}>
						<sphereGeometry args={[0.4, 8, 8]} />
						<meshPhysicalMaterial
							color={props.page >= 4 ? colors : '#666'}
							depthWrite={false}
						/>
					</instancedMesh>
				</group>
			</group>
		</>
	);
}
export default Cells;
