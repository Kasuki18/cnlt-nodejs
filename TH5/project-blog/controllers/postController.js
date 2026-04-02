const BlogPost = require('../models/BlogPost');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.render('index', { posts });
    } catch (err) {
        console.error(err); // In lỗi ra terminal để debug
        res.status(500).send("Lỗi cụ thể: " + err.message); 
    }
};

exports.getPostById = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('detail', { post });
};

exports.renderAddForm = (req, res) => {
    res.render('create'); // Khớp với file create.ejs của bạn
};

exports.createPost = async (req, res) => {
    await BlogPost.create(req.body);
    res.redirect('/');
};

exports.renderEditForm = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('edit', { post });
};

exports.updatePost = async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/posts/${req.params.id}`);
};

exports.deletePost = async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/');
};