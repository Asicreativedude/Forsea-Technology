/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { folder, useControls } from 'leva';
import {
	EffectComposer,
	Bloom,
	HueSaturation,
	DepthOfField,
} from '@react-three/postprocessing';
import { PerspectiveCamera } from '@react-three/drei';

// import gsap from 'gsap';

import Cells from './Components/Cells';
import CellsInner from './Components/CellsInner';
import StemCells from './Components/StemCells';

export function Experience() {
	const properties = useControls('camera', {
		cameraX: { min: -100, max: 100, value: 0, step: 1, label: 'Camera X' },
		cameraY: { min: -100, max: 100, value: 100, step: 1, label: 'Camera Y' },
		cameraZ: { min: -100, max: 100, value: 0, step: 1, label: 'Camera Z' },
	});

	const pages = useControls({
		SelectPage: {
			value: 0,
			min: 0,
			max: 10,
			step: 1,
		},
	});

	const [isStemCells, setStemCells] = useState(true);

	return (
		<div className='canvas-c'>
			<Canvas gl={{ antialias: true, alpha: true }}>
				<PerspectiveCamera
					position={[
						properties.cameraX,
						properties.cameraY,
						properties.cameraZ,
					]}
					makeDefault
				/>
				<color attach='background' args={['#222']} />

				<ambientLight intensity={1.5} />
				<directionalLight
					position={[0, 0, 5]}
					intensity={0.4}
					color={'white'}
				/>
				<Suspense fallback={null}>
					<StemCells />
					<CellsInner isStemCells={isStemCells} pages={pages.value} />
					<Cells isStemCells={isStemCells} pages={pages.value} />
				</Suspense>
				<EffectComposer smaa>
					<Bloom intensity={5} />
					<HueSaturation saturation={0.3} />
					<DepthOfField
						focusDistance={0}
						focalLength={0.06}
						bokehScale={10}
						blur={9}
					/>
				</EffectComposer>
			</Canvas>
		</div>
	);
}
export default Experience;
