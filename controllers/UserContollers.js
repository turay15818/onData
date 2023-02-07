import User from "../model/UserModel.js"
import bcrypt from 'bcrypt'

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
        })
        res.status(200).json(response)
        console.log(response);
    } catch (error) {
        res.status(401).json({ msg: error.message })
        console.log(error)
    }
};
export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                uid: req.params.uid
            },
        })
        if (!response) return res.status(404).json({ msg: "User not found" })
        res.status(200).json(response)
        console.log(response)
    } catch (error) {
        res.status(401).json({ msg: error.message })
        console.log(error)
    }
}
export const createUser = async (req, res) => {
    const { userName, password, confPassword } = req.body
    if (password !== confPassword) return res.status(400).json({ msg: "Sorry, but password does not match" });
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        await User.create({
            userName: userName,
            password: hashedPassword,
        });
        res.status(200).json({ msg: "User Added Successfully" })
        console.log(User)
    } catch (error) {
        res.status(401).json({ msg: error.message })
        console.log(error)
    }
};
export const updateUser = async (req, res) => {

    const user = await User.findOne({
        where: {
            uid: req.params.uid
        }
    });

    if (!user) return res.status(404).json({ msg: "Sorry but User does not exit" })
    console.log(user);
    let hashedPassword;
    const { password, confPassword } = req.body;
    if (password === '' || password === null) { hashedPassword = user.password }
    else { hashedPassword = bcrypt.hashSync(password, 10) }
    if (password !== confPassword) return res.status(400).json({ msg: "Sorry, but password does not match" });
    try {
        await User.update({
            password: hashedPassword,
        },
            {
                where: {
                    uid: req.params.uid
                }
            })
        res.status(200).json({ msg: "user Updated Successfully" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
        console.log(error)
    }
}

