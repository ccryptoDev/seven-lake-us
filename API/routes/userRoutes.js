const router = require('express').Router()
const {
  getAllUser, createUser, getLatestAgent, getAllUserById, getSingleDocument,
  getAgentsByEmail, deleteSingleDocument, DownloadDocument,
  updateDocument, updateAgents, addDocuments, getDocuments,
  addOffice, getOffice, updateOffice, getSingleOffice, getFiles,
  updateLeadDetails, listDocuments, updateWebsite,
} = require('../controllers/userCtrl');
const { getVideos, getVideo, addVideo } = require('../controllers/videoCtrl');

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
router.get('/allAgents', getAllUser);
router.get('/allAgents/:id', getAllUserById);

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
router.post('/createAgent', createUser)
router.get('/membernumber', getLatestAgent)
router.get('/getAgentByEmail', getAgentsByEmail)
router.put('/updateAgents', updateAgents)
router.post('/uploaddocuments', addDocuments)
router.get('/getdocuments', getDocuments)
router.get('/getVideos', getVideos)
router.put('/website', updateWebsite)

router.get('/documents', listDocuments)

router.get('/sales/videos', getVideos)
router.get('/sales/videos/:id', getVideo)
router.post('/sales/videos', addVideo)

router.get('/getfiles/:fileName', getFiles)
router.get('/getdocuments/:id', getSingleDocument)
router.delete('/deletedocument/:id', deleteSingleDocument);
router.put('/updateDocument/:id', updateDocument);
router.put('/updatedownload/:id', DownloadDocument);

router.post('/addOffice', addOffice)
router.get('/getOffice', getOffice)
router.put('/updateOffice/:id', updateOffice)
router.get('/getOffice/:id', getSingleOffice);
router.put('/updateleadDetails', updateLeadDetails);

module.exports = router
