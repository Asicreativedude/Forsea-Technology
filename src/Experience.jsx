/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { useControls, Leva } from 'leva';
import {
	EffectComposer,
	Bloom,
	HueSaturation,
	DepthOfField,
} from '@react-three/postprocessing';
import { PerspectiveCamera } from '@react-three/drei';
import { Perf } from 'r3f-perf';
// import gsap from 'gsap';

import Cells from './Components/Cells';
import CellsInner from './Components/CellsInner';
import StemCells from './Components/StemCells';
import BioReactor from './Components/BioReactor';

export function Experience() {
	const pages = useControls({
		SelectPage: {
			value: 1,
			min: 1,
			max: 14,
			step: 1,
		},
	});
	const [cameraPosition, setCameraPosition] = useState([0, 0, 0]);

	const [isStemCells, setStemCells] = useState(true);
	const [bokehScale, setBokehScale] = useState(10);
	const [blur, setBlur] = useState(9);

	const [currentPage, setCurrentPage] = useState(1);
	useEffect(() => {
		setCurrentPage(pages.SelectPage);

		let section = document.getElementById(`page-${currentPage}`);
		section.scrollIntoView({ behavior: 'smooth' });
	}, [pages.SelectPage, currentPage]);

	useEffect(() => {
		if (currentPage === 1) {
			setStemCells(true);
			setBokehScale(10);
			setBlur(9);
		} else if (currentPage === 2) {
			setBokehScale(0);
			setBlur(0);
			setCameraPosition([0, -100, 0]);
		} else if (currentPage === 3) {
			setCameraPosition([0, -200, 0]);
		} else if (currentPage === 4) {
			setCameraPosition([0, -300, 0]);
			setBokehScale(1.5);
			setBlur(9);
			setStemCells(false);
		}
	}, [currentPage]);

	return (
		<div className='canvas-c'>
			<Leva />
			<Canvas gl={{ antialias: true, alpha: true }}>
				<Perf position='top-left' />
				<PerspectiveCamera
					position={[cameraPosition[0], cameraPosition[1], cameraPosition[2]]}
					makeDefault
				/>
				<color attach='background' args={['#222']} />

				<ambientLight intensity={3} />
				<directionalLight
					position={[1, cameraPosition[1] + 1, 5]}
					intensity={1}
					color={'white'}
				/>
				<Suspense fallback={null}>
					<StemCells />
					<CellsInner isStemCells={isStemCells} page={currentPage} />
					<Cells isStemCells={isStemCells} page={currentPage} />
					<BioReactor />
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

{
	/**pages camera settings:
1: 0,0,0
2: 250 instances
3:
4: 100 instances radius 10
5:  */
}
