const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Admin = require('../models/adminModel')
const multerConfig = require('../helper/multer')



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
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            const message = 'Category already exist';
            res.render('addnewCategory',{message})
        }
        else{
        const category =new Category ({
            name:name,
            description:description,
            is_list:true
        })
       
        await category.save();
        res.redirect('/admin/category')
    }
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
        const id = req.query.id;
        console.log(id);
        const categories = await Category.findById(id);
        console.log(categories);
        res.render('editCategory',{categories})
    } catch (error) {
        console.log(error.message);
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.query.id;
        
        const name = req.body.name
        const description = req.body.description
    

        
            const updateCategory = await Category.findByIdAndUpdate(
                { _id: id },
                { name, description },
                { new: true }
            );
            if (updateCategory) {
                console.log('Category Updated:', updateCategory);
            } else {
                console.log('Category not found or update failed.');
            }
        

        res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
    }
};





module.exports = {
    loadCategory,
    addCategory,
    loadaddCategory,
    listCategory,
    updateCategory,
    editCategory
}

