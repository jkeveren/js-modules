/*

Use this in your node app to import modules from https://js-modules.keve.ren

*/

import https from 'https';

global.import = async moduleNames => {
	const modules = {};
	const modulePromises = [];
	for (const moduleName of moduleNames) {
		modulePromises.push((async () => {
			const file = await new Promise((resolve, reject) => {
				const request = https.request(`https://js-modules.keve.ren/${moduleName}.mjs`);
				request.on('error', reject);
				request.on('response', response => {
					if (response.statusCode !== 200) {
						return reject(new Error(`module "${moduleName}" does not exist`));
					}
					const chunks = [];
					response.on('readable', () => {
						let chunk;
						while (chunk = response.read()) {
							chunks.push(chunk);
						}
					});
					response.on('end', () => resolve(Buffer.concat(chunks)));
				});
				request.end();
			});
			modules[moduleName.split(';')[0]] = (await import(`data:text/javascript,${file}`)).default;
		})());
	}
	await Promise.all(modulePromises);
	return modules;
};

export default global.import;
