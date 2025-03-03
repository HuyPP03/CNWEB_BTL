import { Sequelize, Dialect } from 'sequelize';
import { Users } from '../models/users.model';
import env from '../../env';

const dbConfig = env.database;

const sequelize = new Sequelize(
	dbConfig.name,
	dbConfig.username,
	dbConfig.password,
	{
		host: dbConfig.host,
		dialect: dbConfig.dialect as Dialect,
		port: dbConfig.port,
		pool: {
			max: dbConfig.max,
			min: dbConfig.min,
			acquire: dbConfig.acquire,
			idle: dbConfig.idle,
		},
		logging: dbConfig.logging,
	},
);

const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		// if (dbConfig.isSync) await sequelize.sync({ alter: true });
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

Users.initClass(sequelize);

export const db = {
	sequalize: sequelize,
	users: Users,
	connectToDatabase,
};
