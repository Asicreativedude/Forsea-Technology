/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { Leva } from 'leva';
// import {
// 	EffectComposer,
// 	Bloom,
// 	HueSaturation,
// 	DepthOfField,
// } from '@react-three/postprocessing';

import { PerspectiveCamera } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cells from './Components/Cells';
import CellsInner from './Components/CellsInner';
import StemCells from './Components/StemCells';
import BioReactor from './Components/BioReactor';
import Gmo from './Components/Gmo';
import Scalable from './Components/Scalable';

gsap.registerPlugin(ScrollTrigger);

function Experience() {
	const [cameraPosition, setCameraPosition] = useState([0, 0, 0]);

	const [isStemCells, setStemCells] = useState(true);
	// const [bokehScale, setBokehScale] = useState(0);
	// const [blur, setBlur] = useState(0);

	const [currentPage, setCurrentPage] = useState(1);
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		ScrollTrigger.create({
			start: '0',
			scrub: true,
			onUpdate: (self) => {
				setProgress(self.progress * 10);
				let page = self.progress * 10 + 1;
				setCurrentPage(Math.round(page));
			},
		});
	}, []);
	useEffect(() => {
		if (currentPage === 1) {
			setStemCells(true);
			// setBokehScale(10);
			// setBlur(9);
			setCameraPosition([0, 0, 0]);
		} else if (currentPage === 2) {
			// setBokehScale(0);
			// setBlur(0);
			setCameraPosition([0, -100, 0]);
		} else if (currentPage === 3) {
			setCameraPosition([0, -200, 0]);
		} else if (currentPage === 4) {
			setCameraPosition([0, -300, 0]);
			setStemCells(false);
		} else if (currentPage === 8) {
			setCameraPosition([0, -400, 0]);
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
					far={1000}
					near={0.1}
				/>
				<color attach='background' args={['#111']} />
				<ambientLight intensity={3} />
				<directionalLight
					position={[1, cameraPosition[1] + 1, 5]}
					intensity={1.5}
					color={'#F8EDEB'}
				/>
				<Suspense fallback={null}>
					<StemCells />

					{currentPage >= 2 ? (
						<>
							<Cells
								isStemCells={isStemCells}
								page={currentPage}
								progress={progress}
							/>
							<CellsInner isStemCells={isStemCells} page={currentPage} />
							<BioReactor page={currentPage} />

							<Scalable />
						</>
					) : null}
					{currentPage === 6 ? <Gmo page={currentPage} /> : null}
				</Suspense>
				{/* <EffectComposer smaa>
					<HueSaturation saturation={0.3} />
					<Bloom intensity={5} /> 
					<DepthOfField
						focusDistance={0}
						focalLength={0.06}
						bokehScale={bokehScale}
						blur={blur}
					/>
				</EffectComposer> */}
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
5:  
addible cell - organoid from the inside
landsacape - organoid from the outside big
growth factors fade away from the organoid
NonGMO wrap organoid 
NoScaffolding add another organoid

change colors to pinkish skien yellow
*/
}
