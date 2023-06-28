import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function Camera() {
	const state = useThree();
	const cameraPosition = state.camera.position;

	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		ScrollTrigger.create({
			start: '0',
			scrub: true,
			onUpdate: (self) => {
				let page = self.progress * 10 + 1;
				setCurrentPage(Math.round(page));
			},
		});
	}, []);
	useEffect(() => {
		if (currentPage === 1) {
			cameraPosition.set(0, 0, 0);
		} else if (currentPage === 2) {
			cameraPosition.set(0, -100, 0);
		} else if (currentPage === 3) {
			cameraPosition.set(0, -200, 0);
		} else if (currentPage === 4) {
			cameraPosition.set(0, -300, 0);
		} else if (currentPage === 8) {
			cameraPosition.set(0, -400, 0);
		}
	}, [currentPage, cameraPosition]);
}
export default Camera;
