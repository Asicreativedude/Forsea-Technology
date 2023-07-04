/* eslint-disable react/no-unknown-property */

import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

StemCells.propTypes = {
	page: PropTypes.number.isRequired,
	isMobile: PropTypes.bool.isRequired,
};

gsap.registerPlugin(ScrollTrigger);
function StemCells(props) {
	const stemCellsRef = useRef();
	const stemCellsRef2 = useRef();
	const insideMaterial = new THREE.MeshPhysicalMaterial({
		color: '#eee',
		depthWrite: false,
	});

	useEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-1',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		tl.to(stemCellsRef.current.position, {
			duration: 1,

			x: props.isMobile ? -10 : 9,
			y: props.isMobile ? 2 : 15,
			z: props.isMobile ? -3 : -15,
		});
		tl.to(
			stemCellsRef2.current.position,
			{
				duration: 1,
				x: props.isMobile ? -10 : 10,
				y: props.isMobile ? 4 : 20,
				z: props.isMobile ? -3 : -15,
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
	}, [props.isMobile]);

	return (
		<>
			<Float
				speed={1}
				rotationIntensity={1}
				floatIntensity={1}
				floatingRange={[-0.5, 0.5]}>
				<group
					position={props.isMobile ? [0, -2, -4] : [3, 0, -6]}
					ref={stemCellsRef}
					visible={props.page < 3}>
					<mesh>
						<sphereGeometry
							args={props.isMobile ? [0.5, 16, 16] : [1, 16, 16]}
						/>
						<MeshTransmissionMaterial
							color='#ffffff'
							thickness={0.5}
							transmission={0.98}
							roughness={0.6}
							ior={1.25}
							resolution={128}
						/>
					</mesh>
					<mesh material={insideMaterial}>
						<sphereGeometry
							args={props.isMobile ? [0.1, 8, 8] : [0.4, 16, 16]}
						/>
					</mesh>
				</group>
			</Float>
			<Float
				speed={1}
				rotationIntensity={1}
				floatIntensity={1}
				floatingRange={[-0.5, 0.5]}>
				<group
					position={props.isMobile ? [-1, -1, -2] : [5, 0, -3]}
					ref={stemCellsRef2}
					visible={props.page < 3}>
					<mesh>
						<sphereGeometry
							args={props.isMobile ? [0.5, 16, 16] : [1, 16, 16]}
						/>
						<MeshTransmissionMaterial
							color='#ffffff'
							thickness={0.5}
							transmission={0.98}
							roughness={0.6}
							ior={1.25}
							resolution={128}
						/>
					</mesh>
					<mesh material={insideMaterial}>
						<sphereGeometry
							args={props.isMobile ? [0.1, 8, 8] : [0.4, 16, 16]}
						/>
					</mesh>
				</group>
			</Float>
		</>
	);
}
export default StemCells;
