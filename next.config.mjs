/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return process.env.NODE_ENV == "development"
			? [
					{
						source: "/api/:path*",
						destination: "http://127.0.0.1:8000/:path*",
					},
			  ]
			: [];
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "8000",
			},
		],
	},
};

export default nextConfig;
