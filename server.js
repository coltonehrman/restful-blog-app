const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// MODELS
const Blog = require('./models/blog');

// MONGOOSE CONNECT
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/restful_blog_app', { useNewUrlParser: true });

// APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// INDEX BLOG
app.get('/blogs', async (req, res) => {
    const blogs = await Blog.find({});
    res.render('blogs/', { blogs });
});

// NEW BLOG
app.get('/blogs/new', (req, res) => {
    res.render('blogs/new');
});

// SHOW BLOG
app.get('/blogs/:blogId', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) throw new Error();
        res.render('blogs/show', { blog });
    } catch(err) {
        console.error(err);
        res.redirect('/blogs');
    }
});

// EDIT BLOG
app.get('/blogs/:blogId/edit', async (req, res) => {
    const { title, image, body } = req.body;
    
    try {
        const blog = await Blog.findById(req.params.blogId);
        res.render('blogs/edit', { blog });
    } catch(err) {
        console.error(err);
        res.redirect('/blogs');
    }
});

// UPDATE BLOG
app.put('/blogs/:blogId', async (req, res) => {
    const { title, image, body } = req.body.blog;
    
    try {
        await Blog.findByIdAndUpdate(req.params.blogId, {
            $set: {
                title, image, body
            }
        });
        
        res.redirect('/blogs/' + req.params.blogId);
    } catch(err) {
        console.error(err);
        res.redirect('/blogs');
    }
});

// DELETE BLOG
app.delete('/blogs/:blogId', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.blogId);
        res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        res.redirect('/blogs');  
    }
});

// CREATE BLOG
app.post('/blogs', async (req, res) => {
    await Blog.create(req.body.blog);
    res.redirect('/blogs');
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('SERVER IS RUNNING');
});