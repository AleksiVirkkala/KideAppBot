module.exports.config = {
	entry: ['src/index.ts'],
	sourcemap: true,
	clean: true,
	noExternal: ['@common/utils', '@common/constants', '@common/types', 'tsup-config-base'],
	dts: true
};
