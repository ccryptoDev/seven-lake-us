const router = require('express').Router()
const { addFormManager, getformManager, updateFormManager, getSingleFormManager, deletesingleFormManagement } = require('../controllers/formManager');


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
// router.get('/allAgents/:id',(req,res,next)=>{
//   console.log('this is line 25'+req.params.id);
//   const a = User.findById(req.params.id).then(result =>{
//     res.status(200).json({
//       user:result
//     })
//   }).catch(err =>{
//     console.log(err)
//     res.status(500).json({
//       error:err
//     })
//   });
//   console.log('this is liine 36'+a);
// });

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
router.post('/addformManager', addFormManager);
router.get('/getformManager', getformManager);
router.put('/addformManager/:id', updateFormManager);
router.get('/getformManager/:id', getSingleFormManager);
router.delete('/deleteformManager/:id', deletesingleFormManagement);
module.exports = router
