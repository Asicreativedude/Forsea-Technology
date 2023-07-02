/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import { Perf } from 'r3f-perf';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cells from './Components/Cells';
import StemCells from './Components/StemCells';
import BioReactor from './Components/BioReactor';
import Gmo from './Components/Gmo';
import Scalable from './Components/Scalable';
import GrowthFactors from './Components/GrowthFactors';
import Organoid from './Components/Organoid';
import SecondOrganoid from './Components/SecondOrganoid';

gsap.registerPlugin(ScrollTrigger);

function Experience() {
	const [currentPage, setCurrentPage] = useState(1);
	const directLightRef = useRef();

	useEffect(() => {
		ScrollTrigger.create({
			start: '0',
			scrub: true,
			onUpdate: (self) => {
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

	useEffect(() => {
		const centerTexts = document.querySelectorAll('.center-text');
		const lastPartTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-10',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
				pin: true,
				onUpdate: (self) => {
					let roundProgress = Math.round(self.progress * 10) / 10;
					console.log(roundProgress);
					if (roundProgress === 0.5) {
						centerTexts.forEach((text) => {
							text.classList.toggle('hidden');
						});
					}
				},
			},
		});
		lastPartTl.to('.white-bg', {
			duration: 1,
			width: '100%',
			height: '100%',
			borderRadius: '0',
		});
	}, []);

	return (
		<div className='canvas-c'>
			<Canvas
				gl={{ antialias: true, alpha: true }}
				camera={{
					near: 0.1,
					far: 10000,
					fov: 55,
				}}>
				<Perf position='top-left' />
				<color attach='background' args={['#222']} />
				<ambientLight intensity={1} />
				<directionalLight
					ref={directLightRef}
					intensity={1}
					color={'#F8EDEB'}
				/>
				<Suspense fallback={null}>
					<StemCells />
					<Cells page={currentPage} />
					<BioReactor page={currentPage} />
					<Organoid page={currentPage} />
					<SecondOrganoid page={currentPage} />
					<GrowthFactors />
					<Gmo page={currentPage} />
					<Scalable page={currentPage} />
				</Suspense>
			</Canvas>
		</div>
	);
}
export default Experience;

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
