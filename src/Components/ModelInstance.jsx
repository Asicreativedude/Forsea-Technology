/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */

import { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';

const context = createContext();

export function Instances({ children, ...props }) {
	const { nodes } = useGLTF('/unagiCompressed.glb');
	const instances = useMemo(
		() => ({
			Sphere: nodes.Sphere,
			Cube: nodes.Cube003_1,
			Cube1: nodes.Cube003_2,
			Logos: nodes['logos-01'],
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
			<instances.Sphere
				rotation={[-Math.PI, 0, 0]}
				scale={[-1.07035828, -0.24931741, -0.95081627]}
			/>
			<group
				position={[0.00433087, 0.03961413, 0.02330243]}
				scale={[0.86152095, 0.13410865, 0.54747868]}>
				<instances.Cube />
				<instances.Cube1 />
			</group>
			<instances.Logos
				position={[0, 0.18740255, 0]}
				rotation={[Math.PI, -9e-8, Math.PI]}
				scale={0.41428968}
			/>
		</group>
	);
}

useGLTF.preload('/unagiCompressed.glb');
