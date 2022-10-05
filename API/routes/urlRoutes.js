const { createURL, updateURL, findURL, listURL, deleteURL } = require('../controllers/urlManagerCtrl');
const router = require('express').Router()

router.get('/urls', listURL);
router.get('/urls/:id', findURL);
router.put('/urls/:id', updateURL);
router.post('/urls', createURL);
router.delete('/urls/:id', deleteURL);

module.exports = router;

/**
 * @swagger
 * /api/user/allAgents:
 *  get:
 *      summary: Returns the agents
 *      description: This returns the agents signed up
 *      tags: [Agents]
 *      responses:
 *          200:
 *            description: List of agents
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  items: {csrfToken: string}
 */


/**
 * @swagger
 * /api/user/createAgent:
 *  post:
 *      summary: Create a new Agent
 *      description: This inserts the agents signed up
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
 */
