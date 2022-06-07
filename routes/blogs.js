
var express = require("express");
const { route } = require(".");
var router = express.Router();

var blogsImport = require("../public/sampleblog");
const {
  blogsDB
} = require('../mongo');
const {
  post
} = require('../app');
/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
      const collection = await blogsDB().collection('blogs50');
      const posts = await collection.find({}).toArray();
      res.json(posts);
  } catch (e) {
      res.status(500).send("Error fetching posts." + e)
  }

});

router.get("/all", async function (req, res, next) {
  try {
    let field = req.query.field;
    let order = req.query.order;
    if (order === "asc") {
        order = 1;
    }
    if (order === "desc") {
        order = -1
    }
    const collection = await blogsDB().collection('blogs50');
    const posts = await collection.find({}).sort({
        [field]: order
    }).toArray();
    res.json(posts);
} catch (e) {
    res.status(500).send("Error fetching posts." + e)
}
});

router.get("/singleblog/:blogId", async function (req, res, next) {
  try {
    const blogId = Number(req.params.blogId) - 1;
    const collection = await blogsDB().collection('blogs50');

    const blogs = await collection.find({}).toArray();
    const foundBlog = blogs[blogId];
    res.json(foundBlog);
} catch (error) {
    res.status(500).send("Error fetching posts." + error)
}
 // const blogId = req.params.blogId;
  //res.json(findBlogId(blogId));
});

const findBlogId = (blogId) => {
  const foundBlog = blogsImport.blogPosts.find(element => element.id === blogId);
  return foundBlog;
};

router.get('/postblog', function (req, res, next) {
  res.render('postblog');
});

router.post("/submit", function (req, res, next) {
  console.log(req.body);
  try {
    const newPost = req.body;
    const collection = await blogsDB().collection('blogs50');
    const latestPost = await collection.find({}).sort({ id: -1 }).limit(1).toArray();
    const blogID = latestPost[0].id + 1;

    const today = new Date().toISOString();

    collection.insertOne({
        'createdAt': today,
        'title': newPost.title,
        'text': newPost.text,
        'author': newPost.author,
        'lastModified': today,
        'category': newPost.category,
        'id': blogID
    });

    // blogPosts.push({ createdAt: new Date().toISOString(), title: newPost.title, text: newPost.text, author: newPost.author, id: (blogCount + 1).toString() });
    // blogCount++;

    res.send('OK');
} catch (e) {
    res.status(500).send('Error.');
};

});

router.get('/displayBlogs', function (req, res, next) {
  res.render('displaysingleblog');
});


//router.delete('/delete-blog/:blogId',function (req, res) {
//  console.log('test');
//  const blogId = req.params.blogId;
//  blogsImport.blogPosts = blogsImport.blogPosts.filter(blog => blog.id != blogId);
//  res.json('Successfully Deleted');
//});
router.get('/deleteBlog/:blogId', (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection('blogs50');
    const blogToDelete = await collection.findOne({id: blogId});
    await collection.deleteOne({id: blogId})
    res.status(200).send('Successfully Deleted')
} catch (error) {
    res.status(500).send("Error deleting blog." + error)
}
})

router.get('/post-blog', (req, res, next) => {
  res.render('postblog');
});

router.put('/modify-blog/:blogId', async function (req, res, next) {
  try {
      const blogId = Number(req.params.blogId);
      const modification = req.body;
      const today = new Date().toISOString();
      const collection = await blogsDB().collection('posts');
      collection.updateOne({ id: blogId }, {
          $set: {
              title: modification.title,
              author: modification.author,
              text: modification.text,
              lastModified: today
          }
      })


      res.send('ok');
  } catch (e) {
      res.status(500).send('Error.');
  }
});
module.exports = router;



