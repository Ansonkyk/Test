
var express = require("express");
const { route } = require(".");
var router = express.Router();

var blogsImport = require("../public/sampleblog");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json("Blogs Index Route");
});

router.get("/all", function (req, res, next) {
  const sortOrder = req.query.sort;
  blogsImport.blogPosts.sort((a, b) => {
    const aCreatedAt = a.createdAt
    const bCreatedAt = b.createdAt

    /* Compare by date object for extra utility
    const aCreatedAt = new Date(a.createdAt)
    const bCreatedAt = new Date(b.createdAt) */

    if (sortOrder === "asc") {
      if (aCreatedAt < bCreatedAt) {
        return -1;
      }
      if (aCreatedAt > bCreatedAt) {
        return 1;
      }
    }
    if (sortOrder === "desc") {
      if (aCreatedAt > bCreatedAt) {
        return -1;
      }
      if (aCreatedAt < bCreatedAt) {
        return 1;
      }
    }
    return 0;
  })

  res.json(blogsImport.blogPosts.map((el) => { return el }));
});

router.get("/singleblog/:blogId", function (req, res, next) {
  const blogId = req.params.blogId;
  res.json(findBlogId(blogId));
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
  res.render('displayBlogs');
});
module.exports = router;

