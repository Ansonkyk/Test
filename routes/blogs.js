
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
  res.render('displaysingleblog');
});


//router.delete('/delete-blog/:blogId',function (req, res) {
//  console.log('test');
//  const blogId = req.params.blogId;
//  blogsImport.blogPosts = blogsImport.blogPosts.filter(blog => blog.id != blogId);
//  res.json('Successfully Deleted');
//});
router.get('/deleteBlog/:blogId', (req, res) => {
  const blogToDelete = req.params.blogId;
  
  blogsImport.blogPosts = blogsImport.blogPosts.filter(blog => blog.id != blogToDelete);

 res.send('successfully deleted');
})

router.get('/post-blog', (req, res, next) => {
  res.render('postblog');
});


module.exports = router;




/*


// ROUTE PARAM
router.get('/single-blog/:blogId', async function (req, res) {
    try {
        const blogId = Number(req.params.blogId) - 1;
        const collection = await blogsDB().collection('blogs50');
        // const foundBlog = await collection.findOne({
        //     id: blogId
        // });
        const blogs = await collection.find({}).toArray();
        const foundBlog = blogs[blogId];
        res.json(foundBlog);
    } catch (error) {
        res.status(500).send("Error fetching posts." + error)
    }

});

router.delete('/delete-blog/:blogId', async (req, res) => {
    try {
        const blogId = Number(req.params.blogId);
        const collection = await blogsDB().collection('blogs50');
        const blogToDelete = await collection.findOne({id: blogId});
        await collection.deleteOne({id: blogId})
        res.status(200).send('Successfully Deleted')
    } catch (error) {
        res.status(500).send("Error deleting blog." + error)
    }
});

router.get('/post-blog', (req, res, next) => {
    res.render('postBlog');
});

router.post('/submit', async function (req, res) {
    try {
        const collection = await blogsDB().collection('blogs50');
        const sortedBlogArr = await collection.find({}).sort({id: 1}).toArray();
        const lastBlog = sortedBlogArr[sortedBlogArr.length - 1];
        let blog = req.body;
        const blogTitle = blog.title ? blog.title : '';
        const blogText = blog.text ? blog.text : '';
        const blogAuthor = blog.author ? blog.author : '';
        const blogCategory = blog.category ? blog.category : '';
        const today = new Date();
        const newBlog = {
            createdAt: today,
            lastModified: today,
            title: blogTitle,
            text: blogText,
            author: blogAuthor,
            category: blogCategory,
            id: Number(lastBlog.id + 1),
        };

        await collection.insertOne(newBlog);
        res.status(200).send('Successfully Posted')
    } catch (error) {
        res.status(500).send("Error posting blog." + error)
    }

});

router.put('/update-blog/:blogId', async function (req, res) {
    try {
        const collection = await blogsDB().collection('blogs50');
        const blogId = Number(req.params.blogId);
        const ogBlog = await collection.findOne({id: blogId});
        let updateBlog = req.body;
        const blogTitle = updateBlog.title ? updateBlog.title : ogBlog.title;
        const blogText = updateBlog.text ? updateBlog.text : ogBlog.text;
        const blogAuthor = updateBlog.author ? updateBlog.author : ogBlog.author;
        const blogCategory = updateBlog.category ? updateBlog.category : ogBlog.category;
        updateBlog = {
            lastModified: new Date(),
            title: blogTitle,
            text: blogText,
            author: blogAuthor,
            category: blogCategory,
        };
        await collection.updateOne({
            id: blogId
        }, {
            $set: updateBlog
        });
        res.status(200).send('Successfully Updated')
    } catch (error) {
        res.status(500).send("Error updating blog." + error)
    }
})
*/
/* HELPER FUNCTION */
/*
let saveBlogPosts = (blogList) => {
    return blogPosts = blogList;
}

let generateBlogs = (blogList, blogId, filterOrUpdate, updatedBlogData) => {

    if (!blogId) {
        return blogList;
    }

    if (filterOrUpdate === "filter") {
        return blogList.filter((blog) => blog.id != blogId);
    }

    if (filterOrUpdate === "update") {
        return blogList.map((blog) => {
            if (blog.id === blogId) {
                return {
                    ...blog,
                    title: updatedBlogData.title ? updatedBlogData.title : blog.title,
                    text: updatedBlogData.text ? updatedBlogData.text : blog.text,
                    author: updatedBlogData.author ? updatedBlogData.author : blog.author
                }
            }
            return blog;
        })
    }
}

let filterBlogListById = (bloglist, id) => {
    return bloglist.filter(blog => blog.id != id);;
}

let findBlogId = (id) => {
    // ANONYMOUS FUNCTION
    const foundBlog = blogPosts.find(blog => blog.id === id);
    return foundBlog;
};

// let sortBlogs = (order, posts) => {
//     if (order === 'asc') {
//         return posts.sort(function (a, b) {
//             return new Date(a.createdAt) - new Date(b.createdAt)
//         })
//     } else if (order === 'desc') {
//         return posts.sort(function (a, b) {
//             return new Date(b.createdAt) - new Date(a.createdAt)
//         });
//     } else {
//         return blogPosts;
//     }
// };

let addBlogPost = (body) => {
    let blog = {
        createdAt: new Date().toISOString("en-US"),
        title: body.title,
        text: body.text,
        author: body.author,
        id: String(blogPosts.length + 1)
    }
    return blog;
}

module.exports = router;
*/