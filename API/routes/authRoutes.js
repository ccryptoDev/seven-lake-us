const {
  signup,
  login,
  resetPassword,
  sfTokenForFrontEnd,
  forgotPasswordMail,
  forgotResetPassword,
  refresh,
  logout,
  inviteAgentEmail,
  leadsEmail,updateSignup,
  userRegisterEmail,
  emailAgentOnwer,
  leadNotes,
  varifyEmail,
  getLeads,
  listInactive,
  sendPassword
} = require('../controllers/authCtrl')

const rateLimit = require('express-rate-limit')
const { myCache } = require('../server')
const router = require('express').Router()

const { protect } = require('../middleware/protect')

const createAccountLimiter = rateLimit({
  windowMs: 5* 60,
  max: 20,
  message: 'Too many accounts created request, please try again after sometime',
})

const loginAccountLimiter = rateLimit({
  windowMs: 5 * 60,
  max: 20,
  message: 'Too many login request, please try again after sometime',
})

const forgotPasswordLimiter = rateLimit({
  windowMs: 5 * 60,
  max: 20,
  message: 'Too many request, please try again after sometime',
})


/**
 * @swagger
 * /api/auth/signup:
 *  post:
 *      summary: Validates the agent
 *      description: This checks the agents credentials
 *      tags: [Agents]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                mobilePhone:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                name:
 *                  type: string
 *                company:
 *                  type: string
 *      parameters:
 *          - in: query
 *            name: code
 *            schema:
 *              type: string
 *      responses:
 *        201:
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                  token:
 *                    type: string
 */
router.post('/signup', createAccountLimiter, signup)
router.get('/users/inactive', listInactive)
router.get('/getleads',getLeads)
router.put('/updatesinup/:id',updateSignup)
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Validates the agent
 *      description: This checks the agents credentials
 *      tags: [Agents]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        201:
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                  token:
 *                    type: string
 */
router.post('/login', loginAccountLimiter, login)


/**
 * @swagger
 * /api/auth/email/forgotPassword:
 *  post:
 *      summary: Triggers email when executed
 *      description: This sends mail to the user for reset password
 *      tags: [Agents]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *      responses:
 *        200:
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                  data:
 *                    type: string
 */
router.post('/email/forgotPassword/', forgotPasswordLimiter, forgotPasswordMail)
router.patch(
  '/forgotPassword/:resettoken',
  forgotPasswordLimiter,
  forgotResetPassword
)

router.post('/refresh', protect, refresh)
router.post('/logout', protect, logout)

router.post('/inviteAgent',inviteAgentEmail)
router.post('/leadsMail',leadsEmail)
router.post('/registerMail',userRegisterEmail)
router.post('/registerMailToOwner', emailAgentOnwer)
router.post('/leadNotes',leadNotes)
router.get('/verifyEmail/:id',varifyEmail)

/**
 * @swagger
 * /api/auth/resetPassword:
 *  patch:
 *      summary: Resets the password
 *      description: Reset password for the user
 *      tags: [Agents]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                newPassword:
 *                  type: string
 *      responses:
 *        200:
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                  msg:
 *                    type: string
 */
router.patch('/resetPassword', resetPassword)
router.post('/password/send', sendPassword)
router.get('/token/sf', protect, sfTokenForFrontEnd)

router.get('/cacheStats', (req, res, next) => {
  res.json({
    status: 'success',
    stats: myCache.getStats(),
    ttl: myCache.getTtl('sfToken'),
  })
})

module.exports = router
