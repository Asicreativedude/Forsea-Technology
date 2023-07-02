/* eslint-disable react/no-unknown-property */

import { useEffect, useRef } from 'react';
import { Instances, Model } from './ModelInstance';
import { useThree } from '@react-three/fiber';
// import { Float } from '@react-three/drei';
import gsap from 'gsap';

function Scalable() {
	const unagi = useRef();
	const camera = useThree((state) => state.camera);
	useEffect(() => {
		const cameraTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-9',
				start: 'top bottom',
				end: 'top top',
				scrub: 0.2,
			},
		});
		cameraTl.to(camera.position, {
			duration: 1,
			x: -40,
		});
		const cameraTl2 = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-9',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		cameraTl2.to(camera.position, {
			duration: 1,
			x: -45,
		});
	}, [camera]);
	const positions = [
		{
			position: [3, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [0, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [-3, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [-6, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [-9, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [-12, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [-15, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [-18, -1.5, 0],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
	];

	// useFrame(({ clock }) => {
	// 	const time = clock.getElapsedTime();
	// 	unagi.current.position.x = -40 + Math.sin(time) * 5;
	// });

	return (
		<group ref={unagi} position={[-40, 0, 0]}>
			<Instances>
				{positions.map((props, index) => (
					// <Float
					// 	key={index}
					// 	speed={1}
					// 	rotationIntensity={0}
					// 	floatIntensity={1}
					// 	floatingRange={[-0.5, 0.5]}>
					<Model key={index} {...props} />
					// </Float>
				))}
			</Instances>
		</group>
	);
}
export default Scalable;
