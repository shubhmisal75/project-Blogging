const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

//---------------------2nd-CREATE BLOGS--------------------

const createBlog = async function (req, res) {

  try {
    if (req.user) {
      const blog = req.body;
      if (blog.isPublished == true) {
        blog["publishedAt"] = new Date();
      }
      const id = req.body.authorId;
      let check = await authorModel.findById(id);
      if (check) {
        let write = await blogModel.create(blog);
        res.status(201).send({ msg: "The blog is created ", data:write });
      } else {
        return res.status(400).send({ msg: "Invalid Credential" });
      }
    } else {
    return  res.status(400).send({ err: "Prohibited authentication" });
    }
  } catch (err) {
    return res.status(500).send({ msg: "There is some error" });
  }
};

//-----------------------3rd-GET BLOGS LIST-----------------------------------

const getBlogs = async function (req, res) {
  try {
    if (req.user) {
      let updatedfilter = {
        isDeleted: false,
        isPublished: true,
      };

      if (req.query.authorId) {
        updatedfilter["authorId"] = req.query.authorId;
      }
      if (req.query.category) {
        updatedfilter["category"] = req.query.category;
      }
      if (req.query.tags) {
        updatedfilter["tags"] = req.query.tags;
      }
      if (req.query.subcategory) {
        updatedfilter["subcategory"] = req.query.subcategory;
      }
          console.log(updatedfilter)
      let check = await blogModel.find(updatedfilter);
      if (check.length > 0) {
        return res.status(200).send({ status: true, data: check });
      }
       else {
       return res.status(404).send({ msg: "not find" });
      }
    } else {
     return res.status(404).send({ err: "Invalid AuthorId " });
    }
  } catch (error) {
    return res.status(500).send({ status:false,msg:error.message });
  }
};

//-----------------------------4th- UPDATE BLOG-------------------------------------

const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    let title = req.body.title;
    let body = req.body.body;
    let tags = req.body.tags;
    let subcategory = req.body.subcategory;
    let isPublished = req.body.isPublished;

    const check = await blogModel.findOne({ _id: blogId });
    const authrid = check.authorId

    if (req.user.userId == authrid) 
    { 
      const updatedBlog = await blogModel.findOneAndUpdate(
        { _id: blogId },
        {
          title: title,
          body: body,
          $push: { tags: tags, subcategory: subcategory },
          isPublished: isPublished,
        },
        { new: true }
      );

      if (updatedBlog.isPublished == true) {
        updatedBlog.publishedAt = new Date();
      }
    return res.status(200).send({  status: true,  message: "Blog updated successfully",data: updatedBlog });
    } 
    else {
     return res.status(404).send({ msg: "invalid Authorization" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//---------------------------------5th-DELETE BLOG WITH ID----------------------------------------



const deletebyparams = async function (req, res) {
  try {
    let blogId = req.params.blogId;
   const check = await blogModel.findOne({ _id:blogId,isDeleted:false});
   if(!check){
   return res.status(404).send({status:false,msg:"blog not found"})
   }
    const authorid = check.authorId;

    if (req.user.userId == authorid) {
      let deletedblogs = await blogModel.findOneAndUpdate(
        { _id: blogId, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() }
      );
      if (deletedblogs) {
       return res.status(200).send({ status:true,msg: " Blog deleted SucessFully" });
      } else {
       return res.status(404).send({ msg: "Invalid blogId" });
      }
    } else {
      return res.status(404).send({ err: "Invalid AuthorId " });
    }
  } catch (error) {
   return res.status(500).send({ err: error });
  }
};

//----------------------------6th-DELETE BLOG WITH QUERY----------------------------------------

const deletebyquery = async function (req, res) {
  try {
    if (req.user.userId == req.query.authorId) {
      let updatedfilter = {};

      if (req.query.authorId) {
        updatedfilter["authorId"] = req.query.authorId;
      }
      if (req.query.category) {
        updatedfilter["category"] = req.query.category;
      }
      if (req.query.tags) {
        updatedfilter["tags"] = req.query.tags;
      }
      if (req.query.subcategory) {
        updatedfilter["subcategory"] = req.query.subcategory;
      }
      if (req.query.isPublished) {
        updatedfilter["isPublished"] = req.query.isPublished;
      }
     

      let deleteData = await blogModel.findOne(updatedfilter);
    
      if (!deleteData) {
        return res.status(404).send({ status: false, msg: "Given data is Invalid" });
      }
      if(deleteData.isDeleted == true){
        return res.status(404).send({status:false,msg:"blog is already Deleted !!"})
      }

      deleteData.isDeleted = true;
      deleteData.deletedAt = new Date();
      deleteData.save();

      return res.status(200).send({ msg: "Succesful", data: deleteData });
    } else {
     return res.status(404).send({ msg: "Invalid AuthorId" });
    }
  } catch (error) {
   return res.status(500).send({ msg: error });
  }
};

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deletebyparams = deletebyparams;
module.exports.deletebyquery = deletebyquery;



