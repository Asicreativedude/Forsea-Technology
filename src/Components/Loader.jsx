import { useProgress, Html } from '@react-three/drei';
import { useEffect } from 'react';
function Loader() {
	const { progress } = useProgress();
	useEffect(() => {
		console.log(progress);
	}, [progress]);
	return <Html center>{progress} % loaded</Html>;
}
export default Loader;
