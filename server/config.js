//Constants
var config = {
				MONGODB_URL: process.env.MONGODB_URL || '127.0.0.1',
				MONGODB_PORT: parseInt(process.env.MONGODB_PORT) || 27017,
				MONGODB_DB: process.env.MONGODB_DB || 'test',
				MONGODB_ADMIN_USER: process.env.MONGODB_ADMIN_USER || 'admin',
				MONGODB_ADMIN_PASSWORD: process.env.MONGODB_ADMIN_PASSWORD || 'pass',
				GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '1072189313711.apps.googleusercontent.com',
				GOOGLE_CLIENT_SECRET:  process.env.GOOGLE_CLIENT_SECRET || 'Evqt9n8JS3f50GFCqoyn5ElN',
				GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://127.0.0.1:4000/auth/google/callback'

			};


module.exports = config;