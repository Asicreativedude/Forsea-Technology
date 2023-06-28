/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';

// import {
// 	EffectComposer,
// 	Bloom,
// 	HueSaturation,
// 	DepthOfField,
// } from '@react-three/postprocessing';

import { Perf } from 'r3f-perf';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cells from './Components/Cells';
import CellsInner from './Components/CellsInner';
import StemCells from './Components/StemCells';
import BioReactor from './Components/BioReactor';
import Gmo from './Components/Gmo';
import Scalable from './Components/Scalable';
import Camera from './Components/Camera';

gsap.registerPlugin(ScrollTrigger);

function Experience() {
	const [currentPage, setCurrentPage] = useState(1);
	const [progress, setProgress] = useState(0);
	const directLightRef = useRef();
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
		const lightTl = gsap.timeline({
			scrollTrigger: {
				start: '0',
				end: '+=1000',
				scrub: true,
			},
		});
		lightTl.to(directLightRef.current, {
			y: currentPage + 1.5,
			duration: 1,
		});
	}, [currentPage]);

	return (
		<div className='canvas-c'>
			<Canvas
				gl={{ antialias: true, alpha: true }}
				camera={{
					near: 0.1,
					far: 1000,
					fov: 55,
				}}>
				<Perf position='top-left' />
				<Camera />
				<color attach='background' args={['#222']} />
				<ambientLight intensity={1} />
				<directionalLight
					ref={directLightRef}
					intensity={1}
					color={'#F8EDEB'}
				/>
				<Suspense fallback={'loading'}>
					<StemCells />
					{currentPage >= 2 ? (
						<>
							<Cells page={currentPage} progress={progress} />
							<CellsInner page={currentPage} />
							<BioReactor page={currentPage} />
							<Gmo page={currentPage} />
							<Scalable />
						</>
					) : null}
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
