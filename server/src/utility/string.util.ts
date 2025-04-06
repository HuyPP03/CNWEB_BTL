import env from '../../env';

export const buildHtmlRegisterUser = (token: string, email: string) => {
	const generateUrl = `${env.app.base_url}/api/auth/verify?token=${token}&email=${email}`;
	return `<a href="${generateUrl}">${generateUrl}</a>`;
};
