import axios from 'axios';
import { Deobfuscator } from 'deobfuscator';
import { BotError } from './errorUtils';
import { parse } from '@babel/parser';
import { Node } from '@babel/types';

// ###### UTILS ######

function containsHexCode(str: string, minHexCodes = 1) {
	// Regular expression to match the hexadecimal pattern
	const hexMatches = str.match(/(_0x|0x)[0-9a-fA-F]+/g);
	return hexMatches && hexMatches.length > minHexCodes;
}

export interface ExtraProperties {
	xRequestedTokenKey: string;
	extraId: string;
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

async function extractObfuscatedCodeAreas(code: string) {
	const functions = extractFunctions(code);

	// Find functions that look obfuscated
	const targetAreas: { start: number; end: number; content: string }[] = [];
	functions.forEach(({ start, end, content }) => {
		const isObfuscated = containsHexCode(content, 4);
		if (isObfuscated) {
			targetAreas.push({ start, end, content });
		}
	});

	// Combine ranges that are close to each other
	const mergedTargetAreas = targetAreas.reduce<typeof targetAreas>((acc, curr) => {
		const last = acc[acc.length - 1];
		if (last && curr.start - last.end < 100) {
			last.end = curr.end;
			last.content += curr.content;
		} else {
			acc.push(curr);
		}
		return acc;
	}, []);

	if (mergedTargetAreas.length === 0) {
		throw new Error('Could not find any obfuscated code');
	}
	return mergedTargetAreas;
}

export async function deobfuscate(code: string) {
	const deobfuscator = new Deobfuscator();
	return deobfuscator.deobfuscateSource(code);
}

function extractRequestedTokenKey(deobfuscatedCode: string) {
	const splitted = deobfuscatedCode.split('X-Requested-Token');
	const extraIdKey = `X-Requested-Token${splitted[1].split("'")[0]}`;
	return extraIdKey;
}

function extractExtraId(deobfuscatedCode: string) {
	const splitted = deobfuscatedCode.split(".isTrusted ? '");
	const extraID = splitted[1].split("'")[0];
	return extraID;
}

export async function getLatestExtraPropertiesLocal(): Promise<ExtraProperties> {
	const scriptContent = await getLatestBodyScriptContent();
	const obfuscatedCode = await extractObfuscatedCodeAreas(scriptContent);
	const deobfuscatedCodes = await Promise.all(
		obfuscatedCode.map(({ content }) => deobfuscate(content))
	);

	const xRequestedTokenKey = extractRequestedTokenKey(deobfuscatedCodes.join('\n'));
	const extraId = extractExtraId(deobfuscatedCodes.join('\n'));

	return { xRequestedTokenKey, extraId };
}

export async function getLatestExtraPropertiesFromAPI(apiUrl: string): Promise<ExtraProperties> {
	return axios.get(apiUrl).then(res => res.data);
}

export async function getLatestExtraProperties(apiUrl?: string) {
	const isBrowser = 'window' in globalThis;

	if (apiUrl) {
		return getLatestExtraPropertiesFromAPI(apiUrl);
	}
	if (isBrowser) {
		throw new BotError('apiUrl is required when running in browser, because of CORS');
	}
	return getLatestExtraPropertiesLocal();
}

function extractFunctions(code: string) {
	try {
		// Parse the JavaScript code
		const ast = parse(code, {
			sourceType: 'module',
			plugins: ['jsx', 'typescript', 'decorators-legacy']
		});

		// Get all top-level statements
		const topLevelNodes = ast.program.body;

		// Filter out variable declarations and extract the code
		const topLevelItems = topLevelNodes
			.filter(
				(node: Node) =>
					// Exclude variable declarations (const, let, var)
					node.type !== 'VariableDeclaration' &&
					// Exclude import statements
					node.type !== 'ImportDeclaration' &&
					// Exclude export declarations
					!node.type.startsWith('Export')
			)
			.map((node: Node) => {
				// Get the original code for this node
				const start = node.start!;
				const end = node.end!;
				return {
					start,
					end,
					content: code.slice(start, end).trim()
				};
			});

		return topLevelItems;
	} catch (error) {
		console.error('Error parsing JavaScript code:', error);
		return [];
	}
}
