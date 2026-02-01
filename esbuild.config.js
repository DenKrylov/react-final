const { build } = require('esbuild');
const path = require('path');
const fs = require('fs/promises');
const { transform } = require('@svgr/core');

const isProd = process.env.NODE_ENV === 'production';

const svgComponentPlugin = {
	name: 'svg-component',
	setup(build) {
		build.onResolve({ filter: /\.svg\?component$/ }, (args) => ({
			path: path.resolve(args.resolveDir, args.path.replace('?component', '')),
			namespace: 'svg-component',
		}));

		build.onLoad({ filter: /\.svg$/, namespace: 'svg-component' }, async (args) => {
			const svg = await fs.readFile(args.path, 'utf8');
			const contents = await transform(
				svg,
				{
					icon: true,
					exportType: 'named',
					namedExport: 'ReactComponent',
					jsxRuntime: 'automatic',
					plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
				},
				{ filePath: args.path }
			);

			return {
				contents,
				loader: 'tsx',
			};
		});
	},
};

build({
	entryPoints: [path.resolve(__dirname, 'src/index.tsx')],
	outdir: 'dist-esbuild',
	bundle: true,
	minify: isProd,
	sourcemap: true,
	target: ['es2019'],
	format: 'esm',
	loader: {
		'.png': 'file',
		'.jpg': 'file',
		'.jpeg': 'file',
		'.svg': 'file',
		'.css': 'css',
	},
	plugins: [svgComponentPlugin],
	define: {
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV || 'development'
		),
	},
	splitting: true,
	chunkNames: 'chunks/[name]-[hash]',
	entryNames: '[name]-[hash]',
	assetNames: 'assets/[name]-[hash]',
	logLevel: 'info',
}).catch(() => process.exit(1));
