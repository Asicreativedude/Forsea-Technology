/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function Belt(props) {
	const { nodes, materials } = useGLTF('/belt.glb');
	materials.Conveyor.side = 0;
	materials.Belt.side = 0;

	return (
		<group {...props} dispose={null}>
			<group position={[0, -1, 4.2]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Conveyor01Frame01_Conveyor_0_1.geometry}
					material={materials.Conveyor}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Conveyor01Frame01_Conveyor_0_2.geometry}
					material={materials.Belt}
				/>
			</group>
		</group>
	);
}

useGLTF.preload('/belt.glb');
