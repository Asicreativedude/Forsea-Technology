/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { useControls } from 'leva';
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
	const [cameraPosition, setCameraPosition] = useState([
		properties.cameraX,
		properties.cameraY,
		properties.cameraZ,
	]);
	const [isStemCells, setStemCells] = useState(true);
	const [bokehScale, setBokehScale] = useState(10);
	const [blur, setBlur] = useState(9);

	useEffect(() => {
		if (pages.SelectPage === 0) {
			setStemCells(true);
			setBokehScale(10);
			setBlur(9);
		} else if (pages.SelectPage === 1) {
			setBokehScale(0);
			setBlur(0);
			setCameraPosition([-30, 10, 85]);
		}
	}, [pages.SelectPage]);
	return (
		<div className='canvas-c'>
			<Canvas gl={{ antialias: true, alpha: true }}>
				<PerspectiveCamera
					position={[cameraPosition[0], cameraPosition[1], cameraPosition[2]]}
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
						bokehScale={bokehScale}
						blur={blur}
					/>
				</EffectComposer>
			</Canvas>
		</div>
	);
}
export default Experience;
