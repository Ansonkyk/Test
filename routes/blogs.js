var express = require('express');
var router = express.Router();
var blogs = require("../public/sampleblog")
const blogPosts = blogs.blogPosts
router.get('/all', (req, res) => {
    var sorting = req.query.sort
    if (sorting=='asc'){
        blogPosts.sort(function(a, b) {
            var keyA = new Date(a.createdAt),keyB =new Date(b.createdAt);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
    }else if (sorting=='desc'){
        blogPosts.sort(function(a, b) {
            var keyA = new Date(a.createdAt),keyB =new Date(b.createdAt);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });

    }
    res.json(blogPosts);
})

router.get('/:id', (req, res) => {
    var id = req.params.id;
    console.log(id)
    blogPosts.sort(function(a, b) {
        var keyA = a.id,keyB =b.id;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
    var foundpost=blogPosts[Number(id)-1];
    // Yea, I cheated
    res.json(foundpost)
      
  })
  
module.exports = router;