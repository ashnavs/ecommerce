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
        console.log(req.file);
        console.log(req.body);
        
        const category =new Category ({
            // image:req.file.filename,
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
        const { name, description } = req.body;

        // Handle image update if a new image is provided
        // if (req.file) {
        //     // Assuming the image field in your Category model is named 'image'
        //     const imagePath = req.file.filename;
        //     // Update the image field along with other fields
        //     const updateCategory = await Category.findByIdAndUpdate(
        //         { _id: id },
        //         { name, description, image: imagePath },
        //         { new: true }
        //     );
        //     if (updateCategory) {
        //         console.log('Category Updated:', updateCategory);
        //     } else {
        //         console.log('Category not found or update failed.');
        //     }
        // } else {
            // If no new image is provided, update other fields without the image
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

