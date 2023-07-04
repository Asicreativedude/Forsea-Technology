/* eslint-disable react/no-unknown-property */

import { useRef, useEffect, useState } from 'react';
import { Instances, Model } from './ModelInstance';

import { Float } from '@react-three/drei';
import { ScrollTrigger } from 'gsap/all';
import PropTypes from 'prop-types';

Scalable.propTypes = {
	page: PropTypes.number.isRequired,
};
function Scalable(props) {
	const unagi = useRef();
	const [visible, setVisible] = useState(false);
	const positions = [
		{
			position: [-0.5, -3, 0],
			rotation: [Math.PI / 1.8, Math.PI, Math.PI * 2],
		},
		{
			position: [1, -1.5, -0.5],
			rotation: [Math.PI / 1.8, Math.PI, Math.PI * 2],
		},
		{
			position: [-1, 0, 0.5],
			rotation: [Math.PI / 1.8, Math.PI, Math.PI * 2],
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
	return (
		<group
			ref={unagi}
			position={[0, -1, 0]}
			visible={props.page > 7 && visible}>
			<Instances>
				{positions.map((props, index) => (
					<Float
						key={index}
						speed={1}
						rotationIntensity={0.2}
						floatIntensity={0.2}
						floatingRange={[-0.5, 0.5]}>
						<Model {...props} />
					</Float>
				))}
			</Instances>
		</group>
	);
}
export default Scalable;
