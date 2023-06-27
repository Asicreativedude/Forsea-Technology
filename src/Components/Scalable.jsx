/* eslint-disable react/no-unknown-property */

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import PropTypes from 'prop-types';
Scalable.propTypes = {
	page: PropTypes.number.isRequired,
};
function Scalable(props) {
	const { nodes, materials } = useGLTF('src/assets/unagi3.glb');
	const unagi = useRef();

	console.log(materials);
	// materials.base.metalness = 1;
	materials.base.opacity = 0.3;

	useFrame(({ clock }) => {
		// unagi.current.rotation.y += 0.001;
	});

	return (
		<group
			ref={unagi}
			dispose={null}
			scale={[0.5, 0.5, 0.5]}
			position={[0, -400.5, -2]}
			rotation={[0, Math.PI / 4, 0]}>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Sphere.geometry}
				material={materials.Plastic}
				rotation={[-Math.PI, 0, 0]}
				scale={[-1.07, -0.249, -0.951]}
			/>
			<group scale={[0.876, 0.876, 0.656]}>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Plane_1.geometry}
					material={materials.base}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Plane_2.geometry}
					material={materials.pasted__Salmon1}
				/>
			</group>
			<mesh
				castShadow
				receiveShadow
				geometry={nodes.Plane001.geometry}
				material={materials.base}
				position={[0, -0.001, -0.003]}
				scale={[0.876, 0.876, 0.656]}
			/>
		</group>
	);
}
export default Scalable;
