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
				end: 'bottom center',
				scrub: true,
			},
		});
		gmoTl.to(gmoRef.current.position, {
			duration: 1,
			x: 9,
		});
	}, []);
	return (
		<group ref={gmoRef} position={[20, -302.5, -10]} rotation={[0, 0, 0]}>
			<mesh>
				<torusGeometry args={[5, 0.1, 96, 96]} />
				<meshPhysicalMaterial>
					<GradientTexture
						stops={[0, 0.5, 1]} // As many stops as you want
						colors={['#A7E2D4', '#A7E2D4', '#000']} // Colors need to match the number of stops
						size={1024} // Size is optional, default = 1024
					/>
				</meshPhysicalMaterial>
			</mesh>
			<mesh>
				<circleGeometry args={[5, 32]} />
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
