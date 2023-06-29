/* eslint-disable react/no-unknown-property */

import { useRef } from 'react';
import { MathUtils } from 'three';
import { Instances, Model } from './ModelInstance';

function Scalable() {
	const unagi = useRef();
	const positions = Array.from({ length: 5 }, () => ({
		position: [
			MathUtils.randFloatSpread(1),
			MathUtils.randFloatSpread(10),
			MathUtils.randFloatSpread(1),
		],
	}));

	return (
		<Instances ref={unagi}>
			{positions.map((props, index) => (
				<Model key={index} {...props} />
			))}
		</Instances>
	);
}
export default Scalable;
