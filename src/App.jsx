/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/no-unknown-property */

import Experience from './Experience';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';

export function App() {
	const isMobile = window.innerWidth < 991;
	const [switchText, setSwitchText] = useState(false);

	useEffect(() => {
		if (isMobile) {
			gsap.registerPlugin(ScrollTrigger);

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
					x: '-100vw',
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

			const progressBar = document.querySelector('.progress');
			ScrollTrigger.create({
				trigger: '.tech-embed-wrapper',
				start: 'top top',
				scrub: true,
				onUpdate: (self) => {
					progressBar.style.width = `${self.progress * 100}%`;
				},
			});

			const sections = document.querySelectorAll('.section_page');

			let index = 0;
			gsap.timeline({
				scrollTrigger: {
					trigger: '.tech-embed-wrapper',
					start: 'top top',
					scrub: true,
					onUpdate: (self) => {
						index = Math.round(self.progress * 10) + 1;
						console.log(index);
						sections.forEach((section) => {
							if (index > 9) {
								return;
							}
							if (section.id === `page-${index}`) {
								section.classList.add('active');
							} else {
								section.classList.remove('active');
							}
						});
					},
				},
			});

			const lastPartTl = gsap.timeline({
				scrollTrigger: {
					trigger: '#page-10',
					start: 'top top',
					end: 'bottom top',
					scrub: 0.2,
					pin: true,
					onUpdate: (self) => {
						console.log(self.progress);
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
			const centerTexts = document.querySelectorAll(
				'.section-page-circle-text'
			);
			centerTexts.forEach((text) => {
				text.classList.toggle('hidden');
			});
		}
		gsap.timeline({
			scrollTrigger: {
				trigger: '.section_bring-out',
				start: 'top 25%',
				onEnter: () => {
					document.querySelector('.trigger-roll-in').click();
				},
			},
		});
	}, [isMobile, switchText]);

	return (
		<>
			{isMobile ? null : <Experience />}
			{isMobile ? null : (
				<div className='page-w'>
					<div className='section_page' id='page-1'>
						<div className='container'>
							<div className='section-page-content'>
								<h2 className='section-page-h2'>
									Using proprietary Forsea methods, we collect stem cells from
									fish without causing them any harm.
								</h2>
							</div>
						</div>
						<div className='blur-c'></div>
					</div>
					<div className='section_page' id='page-2'>
						<div className='container'>
							<div className='section-page-content'>
								<h2 className='section-page-h2'>
									We create a master cell bank from the cells we’ve collected,
									which has unique characteristics and infinite cell growth
									capabilities.
								</h2>
							</div>
						</div>
					</div>
					<div className='section_page' id='page-3'>
						<div className='container'>
							<div className='section-page-content'>
								<h2 className='section-page-h2'>
									We use bioreactors to build and grow organoids.
								</h2>
							</div>
						</div>
					</div>
					<div className='section_page' id='page-4'>
						<div className='container'>
							<div className='section-page-content'>
								<h2 className='section-page-h2'>
									These organoids contain all of the addible cells we need.
								</h2>
							</div>
						</div>
					</div>
					<div className='section_page' id='page-5'>
						<div className='container'>
							<div className='section-page-content'>
								<h2 className='section-page-h2 is--xl'>
									With our organoids, we are changing the landscape of
									cultivated meat
								</h2>
							</div>
						</div>
					</div>
					<div className='section_page' id='page-6'>
						<div className='container'>
							<div className='section-page-content'>
								<div className='section-page-pagination'>01/04</div>
								<h3 className='section-page-h3'> Less Growth Factors</h3>
								<p className='section-page-p'>
									Organoids are directed to grow naturally into mini-tissue,
									allowing for a remarkable reduction in growth factors usage.
								</p>
							</div>
						</div>
					</div>
					<div className='section_page' id='page-7'>
						<div className='container'>
							<div className='section-page-content'>
								<div className='section-page-pagination'>02/04</div>
								<h3 className='section-page-h3'>Non-GMO</h3>
								<p className='section-page-p'>
									By harnessing nature’s tissue formation methods, we are able
									to produce non-GMO cultivated meat that is both healthy and
									nourishing.
								</p>
							</div>
						</div>
					</div>
					<div className='section_page' id='page-8'>
						<div className='container'>
							<div className='section-page-content'>
								<div className='section-page-pagination'>03/04</div>
								<h3 className='section-page-h3'>No Scaffolding</h3>
								<p className='section-page-p'>
									Our organoids contain the edible cell. Therefore, scaffolding
									is not necessary for cultivating our seafood meat.
								</p>
							</div>
						</div>
					</div>
					<div className='section_page is--page-9' id='page-9'>
						<video autoPlay muted loop id='myVideo'>
							<source src='../Comp.mp4' />
						</video>
						<div className='container'>
							<div className='section-page-content'>
								<div className='section-page-pagination'>04/04</div>
								<h3 className='section-page-h3'>
									A Scalable Cost- Effective Process
								</h3>
								<p className='section-page-p'>
									The organoid’s unique characteristics allow us to bypass many
									costly production steps.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
