
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
  var temp = req.body
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T';
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + today.getMilliseconds() + "Z";
  var dateTime = date + time;
  blogsImport.blogPosts.push({
    createdAt:dateTime,
    id:(blogsImport.blogPosts.length+1).toString(),
    title:temp.title,
    text: temp.text,
    author: temp.author


  });
  res.send('ok');

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


module.exports = router;



