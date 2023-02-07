import express from "express"
import {updateUser, createUser, getUserById, getUsers} from "../controllers/UserContollers.js"
import { verifyUser } from "../middleware/Auth.js"
import { Login, Me } from "../controllers/Authentication.js"
const router = express.Router()


router.post('/login', Login)
router.get('/me', Me)

router.get('/users',  getUsers)
router.post('/users',  createUser)
router.get('/users/:id', verifyUser, getUserById)
router.patch('/users/:id', verifyUser, updateUser)

export default router