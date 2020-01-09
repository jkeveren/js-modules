/*

Logs argument(s) to console and returns argument or array of arguments.
Useful for debugging.

Usage:
	"log('hello')"
		- logs the string "hello" to console.
		- returns the string "hello".
	"log('hello', 'there')"
		- logs strings "hello" and "there" on seperate lines.
		- returns the array "['hello', 'there']".

*/

const log = (...args) => {
	for (const argument of args) {
		console.log(argument);
	}
	return args.length > 1 ? args : args[0];
};

export default log;

export const test = (log, fail) => {
	const originalConsoleLog = console.log;
	let executedConsoleLog = false;
	console.log = () => executedConsoleLog = true;
	const argument = Math.random();
	const returnValue = log(argument);
	if (!executedConsoleLog) {
		fail('did not execute console.log');
	}
	if (returnValue !== argument) {
		fail(`returned "${returnValue}" instead of expected "${argument}"`);
	}
	console.log = originalConsoleLog;
}
