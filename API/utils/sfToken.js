const axios = require('axios')

const getSfToken = async (req, res, next) => {
  const params = new URLSearchParams()
  params.append('grant_type', process.env.SF_AUTH_BODY_GRANT_VALUE)
  params.append('client_id', process.env.SF_AUTH_BODY_CLIENT_ID_VALUE)
  params.append('client_secret', process.env.SF_AUTH_BODY_CLIENT_SECRET_VALUE)
  params.append('refresh_token', process.env.SF_AUTH_BODY_REFRESH_TOKEN_VALUE)

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  try {
    const res1 = await axios.post(process.env.SF_AUTH_URL, params, config)
    if (res1?.data?.access_token) {
      const params1 = new URLSearchParams()
      params1.append('token', res1?.data?.access_token)
      params1.append('client_id', process.env.SF_AUTH_BODY_CLIENT_ID_VALUE)
      params1.append(
        'client_secret',
        process.env.SF_AUTH_BODY_CLIENT_SECRET_VALUE
      )
      params1.append('token_type_hint', process.env.SF_TOKEN_TYPE_HINT)

      const config1 = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }

      const res2 = await axios.post(
        process.env.SF_TOKEN_INTROSPECT_URL,
        params1,
        config1
      )

      if (!res2.data.active) {
        return { token: res1?.data?.access_token, tokenExpiry: 1 }
      }

      const expTime = new Date(res2.data.exp * 1000)
      const now = Date.now()
      const diff = expTime - now
      const tokenExpiry = Math.floor(diff / 1000)
      return { token: res1?.data?.access_token, tokenExpiry }
    }
  } catch (error) {
    console.log(error?.response?.data)
    res.status(400).json({
      status: 'fail',
      msg: 'Error in getting token',
    })
  }
}

module.exports = getSfToken
