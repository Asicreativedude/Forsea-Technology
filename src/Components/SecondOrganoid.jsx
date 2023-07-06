/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useLayoutEffect, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshTransmissionMaterial } from '@react-three/drei';
import PropTypes from 'prop-types';
import gsap from 'gsap';

Organoid.propTypes = {
	page: PropTypes.number.isRequired,
};

function Organoid(props) {
	const cell = useRef();
	const cellInner = useRef();
	const masterBank = useRef();
	const cell2 = useRef();
	const cellInner2 = useRef();
	const masterBank2 = useRef();
	const radius = useRef(5);
	const instances = useRef(80);
	const opacity = useRef(1);
	const tempObject = useMemo(() => new THREE.Object3D(), []);
	const [visible, setVisible] = useState(true);

	const colors = useMemo(() => {
		let cellColors = [
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
			['#FCD2CA', '#FF4775'],
			['#F4755D', '#F4755D'],
		];
		const numInstances = instances.current;
		const colorArray = new Array(numInstances * 3).fill(0);
		let colorIndex = 0;
		for (let i = 0; i < cellColors.length; i++) {
			const groupColors = cellColors[i];
			for (let j = 0; j < groupColors.length; j++) {
				const color = new THREE.Color(groupColors[j]);
				for (
					let k = 0;
					k < numInstances / cellColors.length / groupColors.length;
					k++
				) {
					color.toArray(colorArray, colorIndex);
					colorIndex += 3;
				}
			}
		}
		return colorArray;
	}, []);
	useLayoutEffect(() => {
		let i = 0;
		for (let j = 0; j < instances.current; j++) {
			const id = i++;
			cellInner.current.setColorAt(
				id,
				new THREE.Color(colors[id * 3], colors[id * 3 + 1], colors[id * 3 + 2])
			);
			cellInner2.current.setColorAt(
				id,
				new THREE.Color(colors[id * 3], colors[id * 3 + 1], colors[id * 3 + 2])
			);
		}

		cellInner.current.instanceColor.needsUpdate = true;
		cellInner2.current.instanceColor.needsUpdate = true;
	}, [colors, props.page, radius, tempObject]);

	useEffect(() => {
		for (let j = 0; j < instances.current; j++) {
			const phi = Math.acos(-1 + (2 * j) / instances.current);
			let theta = Math.sqrt(instances.current * Math.PI) * phi;
			const x = radius.current * Math.sin(phi) * Math.cos(theta);
			const y = radius.current * Math.cos(phi);
			const z = radius.current * Math.sin(phi) * Math.sin(theta);
			const id = j;
			tempObject.scale.set(1, 1, 1);
			tempObject.position.set(x, y, z);
			tempObject.updateMatrix();
			cell.current.setMatrixAt(id, tempObject.matrix);
			cellInner.current.setMatrixAt(id, tempObject.matrix);
			cell2.current.setMatrixAt(id, tempObject.matrix);
			cellInner2.current.setMatrixAt(id, tempObject.matrix);
		}
		cell.current.instanceMatrix.needsUpdate = true;
		cellInner.current.instanceMatrix.needsUpdate = true;
		cell2.current.instanceMatrix.needsUpdate = true;
		cellInner2.current.instanceMatrix.needsUpdate = true;

		masterBank.current.scale.set(0, 0, 0);
		masterBank2.current.scale.set(0, 0, 0);
	}, [tempObject]);

	useFrame(() => {
		masterBank.current.rotation.y += 0.001;
		masterBank2.current.rotation.y += 0.001;
	});
	useEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-8',
				start: 'top bottom',
				end: 'top top',
				scrub: 0.2,
			},
		});
		tl.from(masterBank.current.position, {
			duration: 1,
			y: 50,
		}).to(
			masterBank.current.scale,
			{
				x: 1,
				y: 1,
				z: 1,
				duration: 1,
			},
			'<'
		);
		const tl2 = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-7',
				start: 'top center',
				end: 'bottom top',
				scrub: 0.2,
			},
		});
		tl2
			.from(masterBank2.current.position, {
				duration: 1,
				y: 50,
			})
			.to(
				masterBank2.current.scale,
				{
					x: 1,
					y: 1,
					z: 1,
					duration: 1,
				},
				'<'
			);
		const organoidExitTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#page-8',
				start: 'top top',
				end: 'bottom center',
				scrub: 0.2,
				onUpdate: (self) => {
					if (self.progress > 0.9) {
						setVisible(false);
					} else {
						setVisible(true);
					}
				},
			},
		});
		organoidExitTl
			.to(cell.current.material, {
				duration: 1,
				opacity: 0,
			})
			.to(
				cellInner.current.material,
				{
					duration: 1,
					opacity: 0,
				},
				'<'
			)
			.to(
				cell2.current.material,
				{
					duration: 1,
					opacity: 0,
				},
				'<'
			)
			.to(
				cellInner2.current.material,
				{
					duration: 1,
					opacity: 0,
				},
				'<'
			);
	}, []);

	return (
		<>
			<group
				position={[15, 5, -28]}
				ref={masterBank}
				visible={props.page > 6 && visible}>
				<instancedMesh ref={cell} args={[null, null, instances.current]}>
					<sphereGeometry args={[1, 16, 16]} />
					<MeshTransmissionMaterial
						color='#FFF4EB'
						thickness={0.6}
						transmission={0.96}
						roughness={0.2}
						ior={1.25}
						opacity={opacity.current}
						transparent
					/>
				</instancedMesh>
				<instancedMesh ref={cellInner} args={[null, null, instances.current]}>
					<sphereGeometry args={[0.5, 8, 8]} />
					<meshPhysicalMaterial
						color={colors}
						depthWrite={false}
						opacity={opacity.current}
						transparent
					/>
				</instancedMesh>
			</group>
			<group
				position={[8, 3, -30]}
				ref={masterBank2}
				visible={props.page > 5 && props.page < 9}>
				<instancedMesh ref={cell2} args={[null, null, instances.current]}>
					<sphereGeometry args={[1, 16, 16]} />
					<MeshTransmissionMaterial
						color='#FFF4EB'
						thickness={0.6}
						transmission={0.96}
						roughness={0.2}
						ior={1.25}
						opacity={opacity.current}
						transparent
					/>
				</instancedMesh>
				<instancedMesh ref={cellInner2} args={[null, null, instances.current]}>
					<sphereGeometry args={[0.5, 8, 8]} />
					<meshPhysicalMaterial
						color={colors}
						depthWrite={false}
						opacity={opacity.current}
						transparent
					/>
				</instancedMesh>
			</group>
		</>
	);
}
export default Organoid;
