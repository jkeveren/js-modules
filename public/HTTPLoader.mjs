/*

Use this in your node app to import modules over HTTP(S)

Usage:
1. Save this file in your project directory
2. Run your application with the `--experimental-loader HTTPLoader.mjs` option set

*/

import http from 'http';
import https from 'https';

const HTTPModules = {
	http,
	https
};

export const resolve = async (specifier, parentModule, defaultResolver) => {
	const protocolMatch = specifier.match(/^(https?):\/\//);
	if (protocolMatch) {
		const file = await new Promise((resolve, reject) => {
			const request = HTTPModules[protocolMatch[1]].request(specifier);
			request.on('error', reject);
			request.on('response', response => {
				if (Math.floor(response.statusCode / 100) !== 2) {
					throw new Error(`Module "${specifier}" does not exist. Status code: "${response.statusCode}"`)
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
		return {
			url: `data:application/javascript;base64,${file.toString('base64')}`,
			format: 'module'
		}
	} else {
		return defaultResolver(specifier, parentModule);
	}
};
