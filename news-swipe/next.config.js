/**** Next.js config ****/
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ["*"]
		}
	},
	images: {
		domains: [
			"images.unsplash.com",
			"i.imgur.com",
			"cdn.pixabay.com",
			"ichef.bbci.co.uk",
			"static01.nyt.com",
			"assets.bwbx.io"
		]
	}
};

module.exports = nextConfig;