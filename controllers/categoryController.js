const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Admin = require('../models/adminModel')



const loadCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log(categories);
       
        res.render('category',{categories})
    } catch (error) {
        console.log(error.message);
    }
}

const loadaddCategory = async(req,res) =>{
    try {
        res.render('addnewCategory')
    } catch (error) {
        console.log(error.message);
    }
}

const addCategory = async(req,res)=>{
    try {
        const { name, description } = req.body;
        console.log(req.file);
        console.log(req.body);
        
        const category =new Category ({
            image:req.file.filename,
            name:name,
            description:description,
            is_list:true
        })
        await category.save();
        res.redirect('/admin/category')

    } catch (error) {
        console.log(error.message);
    }
}


async function listCategory(req,res){
    try {
        const id = req.query.id;
        const category = await Category.findById(id);
        if(!category){
            console.log("User not found");
        }
        category.is_list = !category.is_list
        await category.save();
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message);
    }
}

const editCategory = async (req,res)=>{
    try {
        res.render('editCategory')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCategory,
    addCategory,
    loadaddCategory,
    listCategory,
    editCategory
}

