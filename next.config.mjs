/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
				{
					source: "/api/:path*",
					destination: `${process.env.BACKEND_PROTOCOL}://`+
					`${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/:path*`,
				}
			]
	},
	images: {
		remotePatterns: [
			{
				protocol: process.env.BASE_PROTOCOL,
				hostname: process.env.BASE_DOMAIN,
				port: process.env.BASE_PORT,
			},
		],
	},
};

export default nextConfig;
