import { environment as env } from "src/environments/environment"

// returns domain of user website URL. examples:
// https://ifundbiz.com/27322 -> ifundbiz.com
// http://getmecapital.com/27322 -> getmecapital.com
// mvpfunding.com/27322 -> mvpfunding.com
// TODO: type user entity
export function getUserDomain(user: { Website: string }): string {
	const url = user.Website.replace(/https?:\/\//, '')
	return url.split('/')[0]
}

export function getDefaultDomain(): string {
	const isLocalhost = window.location.hostname === 'localhost'
	return isLocalhost ? env.defaultWebsite : `${window.location.origin}`
}