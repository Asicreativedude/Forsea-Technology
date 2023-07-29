/* eslint-disable react/no-unknown-property */

import Experience from './Experience';
export function App() {
	const isMobile = window.innerWidth < 991;
	return (
		<>
			{isMobile ? '' : <Experience />}
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
								With our organoids, we are changing the landscape of cultivated
								meat
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
								By harnessing nature’s tissue formation methods, we are able to
								produce non-GMO cultivated meat that is both healthy and
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
								Our organoids contain the edible cell. Therefore, scaffolding is
								not necessary for cultivating our seafood meat.
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
		</>
	);
}
