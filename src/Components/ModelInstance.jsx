/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */

import { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';

const context = createContext();
export function Instances({ children, ...props }) {
	const { nodes } = useGLTF(
		'https://uploads-ssl.webflow.com/645d43bcad69ce6ac8fffa52/64a5735b500fa85b4fa4874c_box2.glb.txt'
	);
	const instances = useMemo(
		() => ({
			Logos: nodes['logos-01001'],
			Cube: nodes.Cube006,
		}),
		[nodes]
	);
	return (
		<Merged meshes={instances} {...props}>
			{(instances) => (
				<context.Provider value={instances} children={children} />
			)}
		</Merged>
	);
}

export function Model(props) {
	const instances = useContext(context);
	return (
		<group {...props} dispose={null}>
			<instances.Logos
				position={[0.004, 0.068, 0.166]}
				rotation={[0, -0.002, 0]}
				scale={0.116}
			/>
			<instances.Cube scale={[0.214, 0.059, 0.335]} />
		</group>
	);
}
useGLTF.preload('/unagiCompressed.glb');
