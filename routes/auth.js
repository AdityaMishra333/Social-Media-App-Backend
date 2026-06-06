const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UserDetails = require("../models/user")

router.post('/register',(req,res)=>{
    let {name, email, password} = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async(err, hash) => {
            let CreatedUser = await UserDetails.create({
                name,
                email,
                password : hash
            })
            res.send("user registered")
        })
    })
})

router.post('/login',async (req,res) => {
    let {email, password} = req.body
    const user = await UserDetails.findOne({email})

    if(!user) return res.status(404).send("user not found")
    const match = await bcrypt.compare(password,user.password)
    if(!match) return res.status(401).send("incorrect password")

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })

    console.log("input password:", password)
    console.log("stored hash:", user.password)
    console.log("match result:", match)
})

router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: "logged out" })
})

module.exports = router