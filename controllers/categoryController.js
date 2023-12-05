const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Admin = require('../models/adminModel')
const multerConfig = require('../helper/multer')
const Product = require('../models/productModel')



// const loadCategory = async (req, res) => {
//     try {
//         const categories = await Category.find();
//         console.log(categories);
       
//         res.render('category',{categories})
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const ITEMS_PER_PAGE = 2;

const loadCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const categoriesCount = await Category.countDocuments();
        const totalPages = Math.ceil(categoriesCount / ITEMS_PER_PAGE);

        const categories = await Category.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.render('category', {
            categories,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

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


// async function listCategory(req,res){
//     try {
//         const id = req.query.id;
//         const category = await Category.findById(id);
//         if(!category){
//             console.log("User not found");
//         }
//         category.is_list = !category.is_list
//         await category.save();
//         res.redirect('/admin/category')
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const listCategory = async (req, res) => {
    try {
        const categoryId = req.query.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            console.log("Category not found");
            return res.status(404).send("Category not found");
        }

        // Toggle the is_list property of the category
        category.is_list = !category.is_list;
        await category.save();

        // Unlist or list associated products based on the category's is_list property
        const productListAction = category.is_list ? { $set: { list: true } } : { $set: { list: false } };
        await Product.updateMany({ category: categoryId }, productListAction);

        console.log(`Category and associated products ${category.is_list ? 'listed' : 'unlisted'} successfully.`);
        res.redirect('/admin/category');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};











const editCategory = async (req,res)=>{
    try {
        const id = req.query.id;
        console.log(id);
        const categories = await Category.findById(id);
        // console.log(categories);
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
                // console.log('Category Updated:', updateCategory);
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

