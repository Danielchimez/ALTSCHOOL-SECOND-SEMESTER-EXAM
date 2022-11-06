const express = require("express");
const moment = require("moment");
const blogModel = require("../models/blogModel");
const blogRoute = require('../routes/blogRoute')
const userModel = require("../models/userModel")

const { query } = require("express");


const getBlogById = async (req, res, next) => {
    try {
      const blog = await blogModel.findById(req.params.blogId)
      if (!blog) {
        res.status(404).json({ status: false, blog: null });
        return 
      }
      blog.readCount++
      await blog.save()
      res.status(200).json({ status: true, blog })
  
    } catch (err) {
      next(err);
    }
};

const getAllBlogs = async (req, res, next) => {
    try {
      const query = req.query;
  
      const {
        created_at,
        state = "published",
        order_by = ("read_count", "reading_time", "created_at"),
        page = 1,
        per_page = 20,
      } = query;
  
      //Query object
      const findQuery = {};
  
      if (created_at) {
        findQuery.created_at = {
          $gt: moment(created_at).startOf("day").toDate(),
          $lt: moment(created_at).endOf("day").toDate(),
        };
      }
  
    
  
      //Searchable by
      const sortQuery = {};
      const sortAttributes = order_by.split(",");
  
     
  
        const blog = await blogModel
          .find(findQuery)
          .sort(sortQuery)
          .skip(page)
          .limit(per_page);
  
        return res.status(200).json({ status: true, blog });


    }catch (err) {
        next(err);
    }
};

const createBlog = async (req, res, next) => {
  
    try {
      
      const user = await userModel.findById(req.user._id)
      console.log("user =>", user);
      if(user){
        
  
      //Calculating read_time.
      function read_time() {
            const blogTexts = req.body.body;
            const wpm = 225;
            const words = blogTexts.trim().split(/\s+/).length;
         return Math.ceil(words / wpm)
        }
  
      const readTime = read_time();
      console.log("readTime =>",readTime);
      const blogCreated = {
            title: req.body.title,
        
            tags: req.body.tags,
            author: `${user.first_name} ${user.last_name}`,
            owner: user._id,
            description: req.body.description,
            body: req.body.body,
            readTime,
        };
     
      const blog = await blogModel.create(blogCreated);
  
      return res.status(201).json({ status: true, blog });
      } else( res.status(401).json({message: "user not found"}))
      
      
    
    } catch (err) {
      next(err);
    }
};

const updateBlog = async (req, res)=>{
    const { id } = req.params
    

    let blog = await blogModel.findById(id)
    console.log("blog =>", blog)
    
    
    if(!blog){
       return res.send(404).json({ status: false,message: "blog not found" })
    }

   
    await blogModel.findOneAndUpdate({_id: id}, {state: req.body.state})
    blog = await blogModel.findById(id)

    return res.json({status: true, blog})

}

const deleteBlog = async (req, res) =>{
    const { id } = req.params
    console.log("ID =>", id);

    const blog = await blogModel.deleteOne({_id : id})

    if(!blog){
        return res.status(401).json({status: false, blog:null, message: "Error deleting wrong blog"})
    }
    
    return res.status(201).json({status: true, blog})
}






module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
}
