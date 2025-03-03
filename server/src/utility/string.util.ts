import env from '../../env';

export const buildHtmlRegisterUser = (encrypted: string) => {
	const generateUrl = `${env.app.base_url}/api/verify?encrypted=${encrypted}`;
	return `<a href="${generateUrl}">${generateUrl}</a>`;
};
