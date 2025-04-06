import { JSONSchemaType } from 'ajv';

interface loginInterface {
	email: string;
	password: string;
}

interface registerInterface {
	email: string;
	fullName: string;
	password: string;
	phone: string;
}

interface verifyInterface {
	token: string;
	email: string;
}

interface forgotPasswordInterface {
	token: string;
	password: string;
}

export const loginSchema: JSONSchemaType<loginInterface> = {
	type: 'object',
	properties: {
		password: { type: 'string', nullable: false },
		email: { type: 'string', nullable: false, format: 'email' },
	},
	required: ['email', 'password'],
	additionalProperties: false,
};

export const registerSchema: JSONSchemaType<registerInterface> = {
	type: 'object',
	properties: {
		email: { type: 'string', nullable: false, format: 'email' },
		fullName: { type: 'string', nullable: false },
		password: { type: 'string', nullable: false },
		phone: { type: 'string', nullable: false },
	},
	required: ['email', 'fullName', 'password', 'phone'],
	additionalProperties: false,
};

export const verifySchema: JSONSchemaType<verifyInterface> = {
	type: 'object',
	properties: {
		token: { type: 'string', nullable: false },
		email: { type: 'string', nullable: false },
	},
	required: ['token', 'email'],
	additionalProperties: false,
};

export const forgotPasswordSchema: JSONSchemaType<forgotPasswordInterface> = {
	type: 'object',
	properties: {
		token: { type: 'string', nullable: false },
		password: { type: 'string', nullable: false },
	},
	required: ['token', 'password'],
	additionalProperties: false,
};
