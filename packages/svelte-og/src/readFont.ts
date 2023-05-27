import fs from 'fs';
import path from 'path';

export const readFont = (filename: string): Buffer => {
	const fontPath = path.join(path.dirname(new URL(import.meta.url).pathname), filename);
	return fs.readFileSync(fontPath);
};
