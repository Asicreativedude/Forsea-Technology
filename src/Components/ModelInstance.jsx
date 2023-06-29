/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */

import { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';

const context = createContext();

export function Instances({ children, ...props }) {
	const { nodes } = useGLTF('/unagi.glb');
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
				scale={[-1.07, -0.249, -0.951]}
			/>
			<group position={[0.004, 0.04, 0.023]} scale={[0.862, 0.134, 0.547]}>
				<instances.Cube />
				<instances.Cube1 />
			</group>
			<instances.Logos
				position={[0, 0.187, 0]}
				rotation={[Math.PI, 0, Math.PI]}
				scale={0.414}
			/>
		</group>
	);
}

useGLTF.preload('/unagi.glb');
