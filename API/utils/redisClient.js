const { createClient } = require("redis")

exports.redisClient = async () => {
	const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = process.env
	let url = 'redis://'
	if (REDIS_PASS) {
		url += `:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`
	} else {
		url += `${REDIS_HOST}:${REDIS_PORT}`
	}
	const client = createClient({
		url
	})
	await client.connect()
	return client
}

/**
 * @param {string} access_token access access_token.
 * @param {number} expires_in seconds after which access_token is invalid.
*/
exports.setToken = async (access_token = '', expires_in = null) => {
	const client = await this.redisClient()
	await client.set('access_token', access_token)

	if (expires_in) {
		let expiresDate = new Date()
		expiresDate.setSeconds(expiresDate.getSeconds() + expires_in)
		await client.set('expires_in', expiresDate.toISOString())
	} else {
		await client.set('expires_in', null)
	}
}

exports.readToken = async () => {
	const client = await this.redisClient()
	const access_token = await client.get('access_token')
	let expires_in = await client.get('expires_in')
	if (expires_in) {
		expires_in = new Date(expires_in)
	}
	return { access_token, expires_in }
}