/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import PropTypes from 'prop-types';
import gsap from 'gsap';

Cells.propTypes = {
	page: PropTypes.number.isRequired,
	isMobile: PropTypes.bool.isRequired,
};
function Cells(props) {
	const cell = useRef();
	const cellInner = useRef();
	const startTime = useRef(null);
	const masterBank = useRef();
	const instances = useRef(200);
	props.isMobile ? (instances.current = 50) : (instances.current = 200);
	const cellSize = useRef(0);
	const tempObject = new THREE.Object3D();
	const radii = props.isMobile ? [2, 4, 6] : [5, 8, 11, 14, 17, 20, 23];
	const opacity = useRef(1);

	useFrame(({ clock }) => {
		if (!startTime.current) {
			if (props.page === 2) {
				startTime.current = clock.getElapsedTime();
			}
			masterBank.current.scale.set(0, 0, 0);
		} else {
			const time = clock.getElapsedTime() - startTime.current;
			masterBank.current.rotation.z = time * -0.05;
			let i = 0;
			let radiusIndex = 0;
			let instancesLeft = instances.current;
			if (cellSize.current < 200) {
				for (let i = 0; i < instances.current; i++) {
					cellSize.current = (time * i) / 200;
				}
			}

			while (instancesLeft > 0) {
				let instancesPerRadius = Math.ceil(
					instancesLeft / (radii.length - radiusIndex) / 2
				);
				if (radiusIndex === 0) {
					if (props.isMobile) {
						instancesPerRadius = 5;
					} else {
						instancesPerRadius = 10;
					}
				}

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
		}

		cell.current.instanceMatrix.needsUpdate = true;
		cellInner.current.instanceMatrix.needsUpdate = true;
		cell.current.material.needsUpdate = true;
		cellInner.current.material.needsUpdate = true;
	});

	useEffect(() => {
		const initialTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-2',
				start: 'top bottom',
				end: 'top top',
				scrub: 0.2,
			},
		});
		initialTl
			.from(masterBank.current.position, {
				duration: 1,
				y: props.isMobile ? '' : -25,
				x: props.isMobile ? -5 : '',
			})
			.to(masterBank.current.scale, {
				duration: 1,
				x: 1,
				y: 1,
				z: 1,
			});

		const opacity = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-2',
				start: 'top top',
				end: 'bottom center',
				scrub: 0.2,
			},
		});
		opacity
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
			);
	}, [props.isMobile]);

	return (
		<>
			<group
				position={props.isMobile ? [0, -11, -20] : [18, -13, -20]}
				ref={masterBank}
				visible={props.page < 3}>
				<instancedMesh ref={cell} args={[null, null, instances.current]}>
					<sphereGeometry args={props.isMobile ? [0.5, 16, 16] : [1, 16, 16]} />
					<MeshTransmissionMaterial
						color='#FFF4EB'
						thickness={0.8}
						transmission={0.96}
						roughness={0.2}
						ior={1.25}
						opacity={opacity.current}
						transparent
					/>
				</instancedMesh>
				<instancedMesh ref={cellInner} args={[null, null, instances.current]}>
					<sphereGeometry args={props.isMobile ? [0.1, 8, 8] : [0.4, 8, 8]} />
					<meshPhysicalMaterial
						color={'#eee'}
						transparent
						opacity={opacity.current}
					/>
				</instancedMesh>
			</group>
		</>
	);
}
export default Cells;
