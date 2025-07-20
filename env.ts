import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

/**
 * Environment variables
 */

if (process.env.DEBUG_LOG) {
	console.log('config', {
		app: {
			path_file_upload: path.join(process.cwd(), 'src/public', 'uploads'),
		},
		database: {
			mongoUri: process.env.MONGODB_URI || '',
		},
		mail: {
			host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
			port: process.env.MAIL_PORT || '2525',
			user: process.env.MAIL_USER || '740ba294e9d57f',
			pass: process.env.MAIL_PASS || 'd5ff0cc1a9a948',
			from: process.env.MAIL_FROM_NAME || 'Platform',
		},
	});
}

export default {
	app: {
		path_file_upload: path.join(process.cwd(), 'src/public', 'uploads'),
		
	},
	database: {
		mongoUri: process.env.MONGO_URI || '',
	},
	mail: {
		host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
		port: process.env.MAIL_PORT || '2525',
		user: process.env.MAIL_USER || '740ba294e9d57f',
		pass: process.env.MAIL_PASS || 'd5ff0cc1a9a948',
		from: process.env.MAIL_FROM_NAME || 'Platform',
	},
};
