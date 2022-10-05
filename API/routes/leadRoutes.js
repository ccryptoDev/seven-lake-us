const { addLead, listLeads } = require('../controllers/leadCtrl')
const { zohoLeads, zohoToken, zohoAgents, getAgentsByMemberNumber, getTeamAgents, gettingOffice, getInvitedAgents, zohoAddLeadsFile, zohoAddAgentsFile, updateNote, messageAgent } = require('../controllers/zohoCtrl')
const router = require('express').Router()

/**
 * @swagger
 * /api/leads/zohoToken:
 *  post:
 *      summary: Fetches the token from zoho CRM
 *      description: This returns the access token
 *      tags: [Leads]
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
 *                  leads:
 *                    type: object
 */
router.post('/zohoToken', zohoToken)
router.get('/gettingallOffice', gettingOffice);

/**
 * @swagger
 * /api/leads/zohoLeads:
 *  get:
 *      summary: Returns the leads from zoho CRM
 *      description: This returns the leads signed up
 *      tags: [Leads]
 *      parameters:
 *          - in: query
 *            name: code
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *            description: List of leads
 *            content:
 *              application/json:
 *                schema:
 *                  status:
 *                      type: string
 *                  leads:
 *                      type: object
 */
router.get('/zohoLeads', zohoLeads)

router.post('/', addLead)
router.get('/', listLeads)

router.put('/note', updateNote)
router.post('/message', messageAgent)

/**
 * @swagger
 * /api/leads/leadsByMemberNumber:
 *  get:
 *      summary: Returns the leads from zoho CRM using a Member number
 *      description: This returns the leads signed up with member number
 *      tags: [Leads]
 *      parameters:
 *          - in: query
 *            name: code
 *            schema:
 *              type: string
 *          - in: query
 *            name: Member_Number
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *            description: List of leads
 *            content:
 *              application/json:
 *                schema:
 *                  status:
 *                      type: string
 *                  agent:
 *                      type: object
 */
router.get('/leadsByMemberNumber', getAgentsByMemberNumber)


/**
 * @swagger
 * /api/leads/zohoAgents:
 *  get:
 *      summary: Returns the leads from zoho CRM
 *      description: This returns the leads signed up
 *      tags: [Leads]
 *      parameters:
 *          - in: query
 *            name: code
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *            description: List of leads
 *            content:
 *              application/json:
 *                schema:
 *                  status:
 *                      type: string
 *                  agents:
 *                      type: object
 */
router.get('/zohoAgents', zohoAgents)

/**
 * @swagger
 * /api/leads/inviteagents:
 *  get:
 *      summary: Returns the agents invited by them
 *      description: This returns the agents
 *      tags: [Agents]
 *      parameters:
 *          - in: query
 *            name: code
 *            schema:
 *              type: string
 *          - in: query
 *            name: member
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *            description: List of agents
 *            content:
 *              application/json:
 *                schema:
 *                  status:
 *                      type: string
 *                  agents:
 *                      type: object
 */
router.get('/inviteagents', getInvitedAgents)

/**
 * @swagger
 * /api/leads/teamagents:
 *  get:
 *      summary: Returns the agents invited by them
 *      description: This returns the agents
 *      tags: [Agents]
 *      parameters:
 *          - in: query
 *            name: code
 *            schema:
 *              type: string
 *          - in: query
 *            name: member
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *            description: List of agents
 *            content:
 *              application/json:
 *                schema:
 *                  status:
 *                      type: string
 *                  team:
 *                      type: object
 */
router.get('/teamagents', getTeamAgents)
router.post('/zohoAgent', zohoAddAgentsFile)
// /**
//  * @swagger
//  * /api/leads/addLead:
//  *  post:
//  *      summary: Inserts the leads
//  *      description: This creates the leads
//  *      tags: [Leads]
//  *      requestBody:
//  *        required: true
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                firstName:
//  *                  type: string
//  *                lastName:
//  *                  type: string
//  *                phoneNumber:
//  *                  type: string
//  *                email:
//  *                  type: string
//  *                company:
//  *                  type: string
//  *                funding:
//  *                   type: string
//  *                document:
//  *                  type: string
//  *                description:
//  *                  type: string
//  *                program:
//  *                   type: string
//  *      responses:
//  *        201:
//  *          description: Created
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  *                properties:
//  *                  status:
//  *                    type: string
//  *                  msg:
//  *                    type: string
//  */
//  router.post('/addLead', addlead)

// /**
//  * @swagger
//  * /api/leads/allLeads:
//  *  get:
//  *      summary: Returns the leads
//  *      description: This returns the leads signed up
//  *      tags: [Leads]
//  *      responses:
//  *          200:
//  *            description: List of leads
//  *            content:
//  *              application/json:
//  *                schema:
//  *                  status: string
//  */
// router.get('/allLeads', findAllLead)
module.exports = router
