/* eslint-disable react/no-unknown-property */

import { useRef, useEffect, useState } from 'react';
import { Belt } from './Belt';
import { Instances, Model } from './ModelInstance';
// import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/all';
import PropTypes from 'prop-types';
import { useFrame, useThree } from '@react-three/fiber';

Scalable.propTypes = {
	page: PropTypes.number.isRequired,
};
function Scalable(props) {
	const unagi = useRef();
	const [visible, setVisible] = useState(false);
	const positions = [
		{
			position: [0, -1.5, 0],
			scale: [1, 1, 1],
			rotation: [0, Math.PI / 12, 0],
		},
		{
			position: [3, -1.5, 0],
			scale: [1, 1, 1],
			rotation: [0, Math.PI / 12, 0],
		},
	];
	useEffect(() => {
		ScrollTrigger.create({
			trigger: '#page-8',
			start: 'top top',
			end: 'bottom top',
			scrub: 0.2,
			onUpdate: (self) => {
				if (self.progress > 0.5) {
					setVisible(true);
				} else {
					setVisible(false);
				}
			},
		});
	}, []);

	useEffect(() => {
		ScrollTrigger.create({
			trigger: '#page-9',
			start: 'top center',
			end: 'bottom top',
			scrub: 0.2,
			onUpdate: (self) => {
				positionOffset.current = self.progress * 15;
			},
		});
	}, []);
	const positionOffset = useRef(0);
	// useFrame(({ clock }) => {
	// 	const t = clock.getElapsedTime();
	// 	if (unagi.current.position.x > -8) {
	// 		unagi.current.position.x -= t * 0.0001;
	// 	} else if (unagi.current.position.x < -3) {
	// 		unagi.current.position.x = -2;
	// 	}
	// 	console.log(unagi.current.position.x);
	// });
	const camera = useThree((state) => state.camera);
	console.log(unagi);

	return (
		<>
			{/* <Belt /> */}
			<group
				ref={unagi}
				position={[0, 0.2, 1]}
				visible={props.page > 7 && visible}>
				<Instances>
					{positions.map((props, index) => (
						<Model {...props} key={index} />
					))}
				</Instances>
			</group>
		</>
	);
}
export default Scalable;
