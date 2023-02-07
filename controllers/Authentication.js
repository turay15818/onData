import User from "../model/UserModel.js";
import bcrypt from 'bcrypt'

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            userName: req.body.userName
        }
    })
    if (!user) return res.status(404).json({ msg: "User Name does not exit" })
    const comparePassword = await bcrypt.compare(req.body.password, user.password)
    if (!comparePassword) return res.status(404).json({ msg: "Password is not correct" })
    const userId = user.userId;
    const id = user.id;
    const userName = user.userName;
    res.status(200).json({ id, userName })
    console.log(res)
}
export const Me = async (req, res) => {
    if (!req.session.userId)
        return res.status(400).json({ msg: "Please login to your account" })
    const user = await User.findOne({
        attributes: ['id', 'userName', ],
        where: {
            uid: req.session.userId
        }
    })
    if (!user) return res.status(404).json({ msg: "User not Found Please try again" })
    res.status(200).json(user)
}

export const LogoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (!err) return res.status(400).json({ msg: "Can't log you out" })
        res.status(200).json({ msg: "Logout Successfully" })
    })
}