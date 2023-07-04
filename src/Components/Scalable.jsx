/* eslint-disable react/no-unknown-property */

import { useEffect, useRef } from 'react';
import { Instances, Model } from './ModelInstance';

import { Float } from '@react-three/drei';
import gsap from 'gsap';
import PropTypes from 'prop-types';

Scalable.propTypes = {
	page: PropTypes.number.isRequired,
};
function Scalable(props) {
	const unagi = useRef();
	useEffect(() => {
		// const cameraTl = gsap.timeline({
		// 	scrollTrigger: {
		// 		trigger: '#page-9',
		// 		start: 'top center',
		// 		end: 'bottom top',
		// 		scrub: 0.2,
		// 	},
		// });
		// cameraTl.to(unagi.current.position, {
		// 	duration: 1,
		// 	x: 0,
		// });
	}, []);
	const positions = [
		{
			position: [-3, 0.5, 1],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [0, 0.5, -1],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [3, 0.5, -3],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [6, 0.5, -5],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
		{
			position: [9, 0.5, -7],
			rotation: [Math.PI / 4, Math.PI, Math.PI / 8],
		},
	];

	return (
		<group ref={unagi} position={[0, 0, 0]} visible={props.page > 7}>
			<Instances>
				{positions.map((props, index) => (
					<Float
						key={index}
						speed={1}
						rotationIntensity={1}
						floatIntensity={1}
						floatingRange={[-0.5, 0.5]}>
						<Model {...props} />
					</Float>
				))}
			</Instances>
		</group>
	);
}
export default Scalable;
