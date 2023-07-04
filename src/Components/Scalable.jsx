/* eslint-disable react/no-unknown-property */

import { useRef } from 'react';
import { Instances, Model } from './ModelInstance';

import { Float } from '@react-three/drei';

import PropTypes from 'prop-types';

Scalable.propTypes = {
	page: PropTypes.number.isRequired,
};
function Scalable(props) {
	const unagi = useRef();

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

	return (
		<group ref={unagi} position={[0, -1, 0]} visible={props.page > 7}>
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
