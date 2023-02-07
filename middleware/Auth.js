import User from "../model/UserModel.js";

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ msg: "Please Login to you account" })
    const user = await User.findOne({
        where: {
            uid: req.session.userId
        }
    })
    if (!user) return res.status(404).json({ msg: "User not Found" })
    req.userId = user.id;
    req.role = user.role;
    next()
}