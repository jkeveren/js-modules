export default stream => new Promise(resolve => {
	const chunks = [];
	stream.on('readable', () => {
		let chunk;
		while (chunk = stream.read()) {
			chunks.push(chunk);
		}
	});
	stream.on('end', () => resolve(Buffer.concat(chunks)));
});
