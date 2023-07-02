/* eslint-disable react/no-unknown-property */

import { GradientTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

function Gmo() {
	const gmoRef = useRef();
	useEffect(() => {
		const gmoTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-7',
				start: 'top bottom',
				end: 'top top',
				scrub: 0.2,
			},
		});
		gmoTl.to(gmoRef.current.position, {
			duration: 1,
			x: 5,
		});
		const gmoExitTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-7',
				start: 'top -25%',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		gmoExitTl.to(gmoRef.current.position, {
			duration: 1,
			y: -15,
		});
	}, []);
	return (
		<group ref={gmoRef} position={[25, -4, -5]} rotation={[0, 0, 0]}>
			<mesh>
				<torusGeometry args={[6, 0.1, 96, 96]} />
				<meshPhysicalMaterial>
					<GradientTexture
						stops={[0, 0.5, 1]} // As many stops as you want
						colors={['#A7E2D4', '#A7E2D4', '#000']} // Colors need to match the number of stops
						size={1024} // Size is optional, default = 1024
					/>
				</meshPhysicalMaterial>
			</mesh>
			<mesh>
				<circleGeometry args={[6, 32]} />
				<meshPhysicalMaterial
					color='#fff'
					transparent
					opacity={0.02}
					side={THREE.DoubleSide}
				/>
			</mesh>
		</group>
	);
}
export default Gmo;
