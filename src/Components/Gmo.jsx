/* eslint-disable react/no-unknown-property */
// import { MeshTransmissionMaterial } from '@react-three/drei';
// import { useState } from 'react';
import PropTypes from 'prop-types';

import { GradientTexture } from '@react-three/drei';
import * as THREE from 'three';
Gmo.propTypes = {
	page: PropTypes.number.isRequired,
};
function Gmo(props) {
	// const [gmoPosition, setGmoPosition] = useState([6.5, -302.5, -10]);

	if (props.page === 7) {
		console.log('GMO');
	}
	return (
		<group position={[6.5, -302.5, -10]} rotation={[0, 0, 0]}>
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
