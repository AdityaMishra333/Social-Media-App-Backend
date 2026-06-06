const router = require("express").Router()
const PostDetails = require("../models/post")
const authMiddleware = require("../middleware/auth")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

router.get('/', async (req, res) => {
    try {
        const posts = await PostDetails.find()
            .populate("author", "name email")
            .populate("comments.user", "name")
            .sort({ createdAt: -1 })
        res.json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', authMiddleware, upload.single("image"), async (req, res) => {
    try {
        console.log("user:", req.user)
        console.log("body:", req.body)
        console.log("file:", req.file)
        
        const { text } = req.body
        const image = req.file ? `/uploads/${req.file.filename}` : undefined

        const post = new PostDetails({
            author: req.user.id,
            text,
            image
        })

        await post.save()
        res.status(201).json(post)
    } catch (err) {
        console.log("POST error:", err.message)
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await PostDetails.findById(req.params.id)
        if (post.likes.includes(req.user.id)) {
            post.likes.pull(req.user.id)
        } else {
            post.likes.push(req.user.id)
        }
        await post.save()
        res.json(post)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body
        const post = await PostDetails.findById(req.params.id)
        post.comments.push({ user: req.user.id, text })
        await post.save()
        res.status(201).json(post)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router