/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unknown-property */

import { useMemo, useContext, createContext, useRef, useEffect } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

const context = createContext();
export function Instances({ children, ...props }) {
	const { nodes } = useGLTF('/unagi.glb');
	const instances = useMemo(
		() => ({
			Cube: nodes.Cube001,
			Cube1: nodes.Cube001_1,
			Cube2: nodes.Cube001_2,
			Cube3: nodes.Cube001_3,
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
	useEffect(() => {
		const scalble = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-9',
				start: 'top center',
				end: 'bottom top',
				scrub: 0.2,
				onUpdate: (self) => {
					positionOffset.current = self.progress * 15;
				},
			},
		});
	}, []);
	const positionOffset = useRef(0);
	const instances = useContext(context);
	const model = useRef();
	useFrame(() => {
		model.current.position.z = -3 + positionOffset.current;
	});
	return (
		<group {...props} dispose={null}>
			<group
				ref={model}
				position={[-2, 0, 0]}
				scale={[0.86152095, 0.13410865, 0.54747868]}>
				<instances.Cube />
				<instances.Cube1 />
				<instances.Cube2 />
				<instances.Cube3 />
			</group>
		</group>
	);
}
useGLTF.preload('/unagiCompressed.glb');
