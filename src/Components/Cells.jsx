/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import PropTypes from 'prop-types';
import gsap from 'gsap';

Cells.propTypes = {
	page: PropTypes.number.isRequired,
	progress: PropTypes.number.isRequired,
};
function Cells(props) {
	const ref = useRef();
	const startTime = useRef(null);
	const masterBank = useRef();
	const radius = useRef(25);
	const instances = useRef(200);
	const speed = 0.5;
	const [cellsGroupPosition, setCellsGroupPosition] = useState([0, -100, 0]);
	const cellSize = useRef(0);
	const tempObject = new THREE.Object3D();
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

	const radii = [5, 8, 11, 14, 17, 20, 23];
	let i = 0;
	let radiusIndex = 0;
	let instancesLeft = instances.current;
	useFrame(({ clock }) => {
		if (!startTime.current) {
			startTime.current = clock.getElapsedTime();
		}
		if (props.page === 2) {
			const time = clock.getElapsedTime() - startTime.current;
			if (cellSize.current < 200) {
				for (let i = 0; i < instances.current; i++) {
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
			masterBank.current.rotation.z = time * -0.05;
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
					if (radiusIndex === 0) tempObject.scale.set(1, 1, 1);
					else
						tempObject.scale.set(
							Math.min((cellSize.current * j) / 50, 1),
							Math.min((cellSize.current * j) / 50, 1),
							Math.min((cellSize.current * j) / 50, 1)
						);
					tempObject.updateMatrix();
					ref.current.setMatrixAt(id, tempObject.matrix);
					instancesLeft--;
				}
				radiusIndex++;
			}

			ref.current.instanceMatrix.needsUpdate = true;
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

				tempObject.position.set(x, y, z);
				tempObject.updateMatrix();
				ref.current.setMatrixAt(id, tempObject.matrix);
			}
		} else if (props.page >= 4) {
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
				ref.current.setMatrixAt(id, tempObject.matrix);
			}
		}
		ref.current.instanceMatrix.needsUpdate = true;
	});
	useEffect(() => {
		const cellBankTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-2',
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
			},
		});
		cellBankTl.from(masterBank.current.scale, {
			duration: 1,
			x: 0,
			y: 0,
			z: 0,
		});
		cellBankTl.to(masterBank.current.position, {
			duration: 1,
			x: 50,
		});
		const organoidTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-4',
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		});

		organoidTl
			.to(masterBank.current.position, {
				duration: 1,
				z: -40,
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

		const organoidMoveTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-5',
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		});
		organoidMoveTl.to(masterBank.current.position, {
			duration: 1,
			y: -310,
			x: 35,
		});
	}, []);
	return (
		<group position={cellsGroupPosition} ref={masterBank}>
			<instancedMesh ref={ref} args={[null, null, instances.current]}>
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
