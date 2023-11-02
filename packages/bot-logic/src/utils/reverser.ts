import axios from 'axios';
import { Deobfuscator } from 'deobfuscator';
import { BotError } from './errorUtils';

// ###### UTILS ######

function containsHexCode(str: string) {
	// Regular expression to match the hexadecimal pattern
	const hexPattern = /(_0x|0x)[0-9a-fA-F]+/g;

	// Search the string for the pattern
	return hexPattern.test(str);
}

// #### MAIN ####

const KIDE_URL = 'https://kide.app';
const BODY_SCRIPT_PATH_BASE = 'scripts/body.js?v=';

async function getLatestBodyScriptVersion() {
	const res = await axios.get(KIDE_URL);
	const htmlString = res.data;

	const splitted = htmlString.split(`src="/${BODY_SCRIPT_PATH_BASE}`);

	if (splitted.length !== 2) {
		throw new Error('There was more or less than one body script in the html');
	}

	const scriptVersion = splitted[1].split('"')[0];

	if (!scriptVersion) {
		throw new Error('Could not find the script version');
	}

	return scriptVersion;
}

async function getLatestBodyScriptContent() {
	const scriptVersion = await getLatestBodyScriptVersion();
	const scriptUrl = `${KIDE_URL}/${BODY_SCRIPT_PATH_BASE}${scriptVersion}`;
	return axios.get(scriptUrl).then(res => res.data);
}

function extractObfuscatedCode(code: string) {
	const splitted = code.split(';');
	const start = splitted.findIndex(line => containsHexCode(line) && line.startsWith('function'));

	const end = splitted.findIndex(
		line => containsHexCode(line) && /\(.*window\[.*'in'\]=window\[.*'in'\]/.test(line)
	);

	// Get the lines between the start and end index
	const lines = splitted.slice(start, end + 1);
	const combined = lines.join(';');

	return combined;
}

async function deobfuscate(code: string) {
	const deobfuscator = new Deobfuscator();
	return deobfuscator.deobfuscateSource(code);
}

function extractExtraID(deobfuscatedCode: string) {
	const splitted = deobfuscatedCode.split("'event.originalEvent.isTrusted') === true ? '");
	const extraID = splitted[1].split("'")[0];
	return extraID;
}

export async function getLatestExtraIdLocal() {
	const scriptContent = await getLatestBodyScriptContent();
	const obfuscatedCode = extractObfuscatedCode(scriptContent);
	const deobfuscatedCode = await deobfuscate(obfuscatedCode);
	const extraID = extractExtraID(deobfuscatedCode);
	return extraID;
}

export async function getLatestExtraIdFromAPI(apiUrl: string) {
	return axios.get(apiUrl).then(res => res.data);
}

export async function getLatestExtraID(apiUrl?: string) {
	const isBrowser = 'window' in globalThis;

	if (apiUrl) {
		return getLatestExtraIdFromAPI(apiUrl);
	}
	if (isBrowser) {
		throw new BotError('apiUrl is required when running in browser, because of CORS');
	}
	return getLatestExtraIdLocal();
}
