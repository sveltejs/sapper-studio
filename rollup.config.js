import svelte from 'rollup-plugin-svelte';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

export default [
	{
		input: ['src/main.ts', 'src/launcher.ts', 'src/project.ts'],
		output: {
			dir: 'dist',
			format: 'cjs'
		},
		plugins: [
			resolve(),
			svelte(),
			commonjs(),
			typescript({
				typescript: require('typescript')
			})
		],
		experimentalCodeSplitting: true,
		experimentalDynamicImport: true,
		external: [
			'electron',
			'child_process',
			'fs',
			'path',
			'url',
			'node-pty',
			'default-shell',
			'xterm'
		]
	}
];