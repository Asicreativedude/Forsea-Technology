/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */

import { useMemo, useContext, createContext, useRef } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
// import { useFrame } from '@react-three/fiber';

const context = createContext();
export function Instances({ children, ...props }) {
	const { nodes } = useGLTF('/fillet.glb');
	const instances = useMemo(
		() => ({
			Cube: nodes.Cube,
		}),
		[nodes]
	);
	instances.Cube.material.side = 0;

	console.log(instances);
	return (
		<Merged meshes={instances} {...props}>
			{(instances) => (
				<context.Provider
					value={instances}
					children={children}
					renderOrder={0}
				/>
			)}
		</Merged>
	);
}

export function Model(props) {
	const model = useRef();
	const instances = useContext(context);
	return (
		<group {...props} dispose={null} ref={model}>
			<instances.Cube
				position={[0, 0, 0]}
				rotation={[Math.PI, -1.5016994, Math.PI]}
				scale={[0.34342137, 0.13872905, 1.02933764]}
			/>
		</group>
	);
}

useGLTF.preload('/fillet.glb');
