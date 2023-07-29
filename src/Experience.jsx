/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
	PerformanceMonitor,
	Preload,
	AdaptiveDpr,
	Environment,
	AdaptiveEvents,
} from '@react-three/drei';
// import { Perf } from 'r3f-perf';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cells from './Components/Cells';
import StemCells from './Components/StemCells';
import BioReactor from './Components/BioReactor';
import GrowthFactors from './Components/GrowthFactors';
import Organoid from './Components/Organoid';
import SecondOrganoid from './Components/SecondOrganoid';

// import { Html, useProgress } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger);

// function Loader() {
// 	const { active, progress, errors, item, loaded, total } = useProgress();
// 	console.log(active, progress, errors, item, loaded, total);
// 	useEffect(() => {
// 		console.log(active, progress);
// 	}, [active, progress]);
// 	return (
// 		<Html style={{ zIndex: '9999', color: 'white' }} center>
// 			{progress} % loaded
// 		</Html>
// 	);
// }

function Experience() {
	const [currentPage, setCurrentPage] = useState(1);
	const [switchText, setSwitchText] = useState(false);
	const [dpr, setDpr] = useState(1);
	const progressBar = useRef(0);

	useEffect(() => {
		ScrollTrigger.create({
			trigger: '.page-w',
			start: 'top top',
			scrub: true,
			onUpdate: (self) => {
				let page = self.progress * 10 + 1;
				setCurrentPage(Math.round(page));
				progressBar.current.style.width = `${self.progress * 100}%`;
			},
		});
	}, [currentPage]);

	//white bg reveal
	useEffect(() => {
		const lastPartTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-10',
				start: 'top top',
				end: 'bottom top',
				scrub: 0.2,
				pin: true,
				onUpdate: (self) => {
					let roundProgress = Math.round(self.progress * 10) / 10;
					if (roundProgress > 0.5) {
						setSwitchText(true);
					} else {
						setSwitchText(false);
					}
				},
			},
		});
		lastPartTl.to('.white-bg', {
			duration: 1,
			width: '100%',
			height: '100%',
			borderRadius: '0',
			filter: 'blur(0px)',
		});
	}, []);

	//last page text switch
	useEffect(() => {
		const centerTexts = document.querySelectorAll('.section-page-circle-text');
		centerTexts.forEach((text) => {
			text.classList.toggle('hidden');
		});
	}, [switchText]);

	//text entrance
	useEffect(() => {
		const sections = document.querySelectorAll('.section_page');
		sections.forEach((section) => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: 'top 15%',
				},
			});
			tl.from(section.querySelector('.section-page-content'), {
				duration: 1,
				opacity: 0,
				ease: 'power4.out',
				yPercent: 25,
			});
		});
	}, []);
	useEffect(() => {
		const microscopeTl = gsap.timeline({
			scrollTrigger: {
				trigger: '.microscrop-svg',
				start: 'top 35%',
				scrub: true,
			},
		});
		microscopeTl
			.to('.microscrop-svg', {
				duration: 1,
				scale: 10,
				x: '-70vw',
			})
			.to(
				'.section_from-cell-to-delicious',
				{
					duration: 1,
					backgroundColor: '#222',
				},
				'<'
			)
			.to('.microscrop-svg', {
				duration: 1,
				opacity: 0,
			});
		gsap.timeline({
			scrollTrigger: {
				trigger: '.section_bring-out',
				start: 'top 15%',
				onEnter: () => {
					document.querySelector('.trigger-roll-in').click();
				},
			},
		});
	}, []);
	return (
		<>
			<div className='canvas-wrapper'>
				<div className='canvas-c'>
					<Canvas
						performance={{ min: 0.5 }}
						dpr={dpr}
						gl={{
							antialias: false,
							alpha: false,
							depth: false,
							stencil: false,
							preserveDrawingBuffer: false,
							shadowMap: {
								enabled: false,
								autoUpdate: false,
								needsUpdate: false,
							},
						}}
						camera={{
							near: 0.1,
							far: 200,
							fov: 55,
						}}>
						{/* <Perf position='top-left' /> */}
						<color attach='background' args={['#222']} />

						<Environment preset='warehouse' />
						<Suspense fallback={null}>
							{currentPage < 3 && <StemCells page={currentPage} />}
							{currentPage < 4 && <Cells page={currentPage} />}
							{currentPage > 1 && currentPage < 5 && (
								<BioReactor page={currentPage} />
							)}
							<Organoid page={currentPage} />
							{currentPage > 5 && currentPage < 8 && (
								<GrowthFactors page={currentPage} />
							)}
							{currentPage > 7 && <SecondOrganoid page={currentPage} />}
						</Suspense>
						<Preload all />
						<PerformanceMonitor
							onChange={({ factor }) => {
								setDpr(Math.round(0.5 + 1.5 * factor, 1));
							}}
						/>
						<AdaptiveEvents />
						<AdaptiveDpr pixelated />
					</Canvas>
				</div>
				<div className='progress-container'>
					<div className='progress-c'>
						<div className='progress' ref={progressBar} />
					</div>
				</div>
			</div>
		</>
	);
}
export default Experience;
