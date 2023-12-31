/* eslint-disable react/no-unknown-property */

import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

StemCells.propTypes = {
	page: PropTypes.number.isRequired,
};

gsap.registerPlugin(ScrollTrigger);
function StemCells(props) {
	const stemCellsRef = useRef();
	const stemCellsRef2 = useRef();
	const insideMaterial = new THREE.MeshPhysicalMaterial({
		color: '#eee',
		depthWrite: false,
	});
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-1',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
				onUpdate: (self) => {
					if (self.progress > 0.4) {
						setVisible(false);
					} else {
						setVisible(true);
					}
				},
			},
		});
		tl.to(stemCellsRef.current.position, {
			duration: 1,

			x: 9,
			y: 15,
			z: -15,
		});
		tl.to(
			stemCellsRef2.current.position,
			{
				duration: 1,
				x: 10,
				y: 20,
				z: -15,
			},
			'<'
		);
		tl.to(
			'.blur-c',
			{
				duration: 1,
				opacity: 0,
			},
			'<'
		);
	}, []);

	return (
		<>
			<Float
				speed={1}
				rotationIntensity={1}
				floatIntensity={1}
				floatingRange={[-0.5, 0.5]}>
				<group
					position={[3, 0, -6]}
					ref={stemCellsRef}
					visible={props.page < 3 && visible}>
					<mesh>
						<sphereGeometry args={[1, 16, 16]} />
						<MeshTransmissionMaterial
							color='#ffffff'
							thickness={0.8}
							transmission={0.96}
							roughness={0.2}
							ior={1.25}
						/>
					</mesh>
					<mesh material={insideMaterial}>
						<sphereGeometry args={[0.4, 16, 16]} />
					</mesh>
				</group>
			</Float>
			<Float
				speed={1}
				rotationIntensity={1}
				floatIntensity={1}
				floatingRange={[-0.5, 0.5]}>
				<group
					position={[5, 0, -3]}
					ref={stemCellsRef2}
					visible={props.page < 3 && visible}>
					<mesh>
						<sphereGeometry args={[1, 16, 16]} />
						<MeshTransmissionMaterial
							color='#ffffff'
							thickness={0.8}
							transmission={0.96}
							roughness={0.2}
							ior={1.25}
						/>
					</mesh>
					<mesh material={insideMaterial}>
						<sphereGeometry args={[0.4, 16, 16]} />
					</mesh>
				</group>
			</Float>
		</>
	);
}
export default StemCells;
