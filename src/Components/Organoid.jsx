/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial, useFBO } from '@react-three/drei';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

Organoid.propTypes = {
	page: PropTypes.number.isRequired,
};

function Organoid(props) {
	const cell = useRef();
	const cellInner = useRef();
	const masterBank = useRef();
	const startTime = useRef();
	const radius = useRef(15);
	const instances = useRef(250);
	const cellSize = useRef(0);
	const speed = 0.5;
	const tempObject = new THREE.Object3D();

	const colors = useMemo(() => {
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
		let i = 0;
		for (let j = 0; j < instances.current; j++) {
			const id = i++;
			cellInner.current.setColorAt(
				id,
				new THREE.Color(colors[id * 3], colors[id * 3 + 1], colors[id * 3 + 2])
			);
		}
		cellInner.current.instanceColor.needsUpdate = true;
	}, [colors]);

	useFrame(({ clock }) => {
		if (!startTime.current) {
			if (props.page === 4) {
				startTime.current = clock.getElapsedTime();
			}

			masterBank.current.scale.set(0, 0, 0);
		} else {
			const time = clock.getElapsedTime() - startTime.current;
			masterBank.current.rotation.y += 0.001;

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

				tempObject.scale.set(
					gsap.utils.clamp(0, 1, (cellSize.current * j) / 50),
					gsap.utils.clamp(0, 1, (cellSize.current * j) / 50),
					gsap.utils.clamp(0, 1, (cellSize.current * j) / 50)
				);

				tempObject.position.set(x, y, z);
				tempObject.updateMatrix();
				cell.current.setMatrixAt(id, tempObject.matrix);
				cellInner.current.setMatrixAt(id, tempObject.matrix);
			}
		}
		cell.current.instanceMatrix.needsUpdate = true;
		cellInner.current.instanceMatrix.needsUpdate = true;
	});
	useEffect(() => {
		ScrollTrigger.create({
			trigger: '#page-4',
			start: 'top center',
			end: 'top top',
			scrub: 0.2,
			onUpdate: (self) => {
				masterBank.current.scale.set(
					self.progress,
					self.progress,
					self.progress
				);
			},
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
				z: -30,
				x: 15,
			})
			.to(
				radius,
				{
					duration: 1,
					current: 10,
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
			y: -13,
		});

		const organoidMoveTl2 = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-7',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		organoidMoveTl2.to(
			radius,
			{
				duration: 1,
				current: 10,
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
		organoidExitTl.to(masterBank.current.scale, {
			duration: 1,
			x: 0,
			y: 0,
			z: 0,
		});
	}, []);
	const buffer = useFBO();
	useFrame((state) => {
		state.gl.setRenderTarget(buffer);
		state.gl.render(state.scene, state.camera);
		state.gl.setRenderTarget(null);
	});
	return (
		<>
			<group position={[0, 0, 0]} ref={masterBank}>
				<instancedMesh ref={cell} args={[null, null, instances.current]}>
					<sphereGeometry args={[1, 16, 16]} />
					<MeshTransmissionMaterial
						color='#FFF4EB'
						thickness={0.8}
						transmission={0.96}
						roughness={0.2}
						ior={1.25}
					/>
				</instancedMesh>
				<instancedMesh ref={cellInner} args={[null, null, instances.current]}>
					<sphereGeometry args={[0.4, 8, 8]} />
					<meshPhysicalMaterial color={colors} />
				</instancedMesh>
			</group>
		</>
	);
}
export default Organoid;
