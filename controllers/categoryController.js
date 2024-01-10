const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Admin = require('../models/adminModel')
const multerConfig = require('../helper/multer')
const Product = require('../models/productModel')




const ITEMS_PER_PAGE = 2;




const loadCategory = async (req, res) => {
    try {
        // Check if there is a success message in the session
        const successMessage = req.session.successMessage;
        // Clear the message from the session
        delete req.session.successMessage;
        const editSuccess = req.session.successMessge
        delete req.session.successMessage;
        const ITEMS_PER_PAGE = 5;

        const page = parseInt(req.query.page , 10) || 1;

        const categoriesCount = await Category.countDocuments();
        const totalPages = Math.ceil(categoriesCount / ITEMS_PER_PAGE);

        const categories = await Category.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.render('category', {
            categories,
            currentPage: page,
            totalPages,
            successMessage,
            editSuccess // Pass the successMessage to the view
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
        if(name === '' && description === ''){
            res.render('addnewCategory' , {message:"Please kjdhfksj"})
        }
        // const existingCategory = await Category.findOne({name});
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });

        if(existingCategory){
            const message = 'Category already exist';
            res.render('addnewCategory',{message})
        }
        else{

        const {discountPercentage} = req.body;

        const category =new Category ({
            name:name,
            description:description,
            is_list:true,
            offer:discountPercentage
        })
       
        await category.save();

         // Set success message in the session
         req.session.successMessage = 'Category added successfully';
        res.redirect('/admin/category')
        const errorMessage = 'Error adding category';
        res.render('addnewCategory', { errorMessage });
    }
    } catch (error) {
        console.log(error.message);
    }
}




// const listCategory = async (req, res) => {
//     try {
//         const categoryId = req.query.id;
//         const category = await Category.findById(categoryId);


//         if (!category) {
//             console.log("Category not found");
//             return res.status(404).send("Category not found");
//         }

//         // Toggle the is_list property of the category
//         category.is_list = !category.is_list;
//         await category.save();

//         // Unlist or list associated products based on the category's is_list property
//         const productListAction = category.is_list ? { $set: { list: true } } : { $set: { list: false } };
//         await Product.updateMany({ category: categoryId }, productListAction);

       
//         res.redirect('/admin/category');
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Internal Server Error');
//     }
// };

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

        res.redirect('/admin/category');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const editCategory = async (req, res) => {
    try {
        const id = req.query.id;
        const categories = await Category.findById(id);
        const errorMessage = req.session.errorMessage;
        req.session.errorMessage = '';
        // Render the editCategory page with the existing category data
        res.render('editCategory', { categories , errorMessage });
    } catch (error) {
        console.log(error.message);
    }
};



// const updateCategory = async (req, res) => {
//     try {
//         const id = req.query.id;
//         const newName = req.body.name;

//         // Check if the new name already exists in the database
//         const existingCategory = await Category.findOne({ name: newName });
//         if (existingCategory) {
//             // If the category already exists, display an error message
//             req.session.errorMessage = 'Category name already exists';
//             return res.redirect(`/admin/edit-category?id=${id}`);
//         }

//         // Update the category in the database
//         await Category.findByIdAndUpdate(id, { name: newName });

//         // Set success message in the session
//         req.session.successMessage = 'Category edited successfully';

//         // Redirect to the category listing page or any other appropriate page
//         res.redirect('/admin/category');
//     } catch (error) {
//         console.log(error.message);
//     }
// };


const updateCategory = async (req, res) => {
    try {
        const id = req.query.id;
        const newName = req.body.name;
        const description = req.body.description
        const discountPercentage =req.body.discountPercentage

        const existingCategory = await Category.findOne({ name:newName });

        if (existingCategory && existingCategory._id.toString() !== id.toString()) {
            req.session.errorMessage = 'Category name already exists';
            return res.redirect(`/admin/edit-category?id=${id}`);
        }

        // Update the category in the database
        await Category.findByIdAndUpdate(id, { name: newName, description, offer: discountPercentage});

        req.session.successMessage = 'Category edited successfully';

        // Redirect to the category listing page or any other appropriate page
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

