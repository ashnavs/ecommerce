const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { model } = require('mongoose');
const path = require('path')
const uploads = require('../helper/multer')
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs-extra');
const flash = require('flash');


const async = require('async');



// async function loadProducts(req, res) {
//   try {
//     const allCategory = await Category.distinct('name');
//     const brands = await Product.distinct('brand');
//     const categories = await Category.find({is_list:true});
//     const user = req.session.user_id

//     // Get the current page from the query parameters, default to 1 if not provided
//     const page = parseInt(req.query.page, 10) || 1;
//     const productsPerPage = 4; // Number of products per page

//     // Use async.parallel to fetch productdata and totalProducts concurrently
//     const results = await async.parallel({
//       productdata: async function () {
//         return Product.find({list:true})
//           .skip((page - 1) * productsPerPage)
//           .limit(productsPerPage)
//           .exec();
//       },
//       totalProducts: async function () {
//         return Product.countDocuments().exec();
//       },
//     });

//     const { productdata, totalProducts } = results;


//     res.render('productsView', {
//       productdata,
//       categories,
//       brands,
//       currentPage: page,
//       totalPages: Math.ceil(totalProducts / productsPerPage),
//       user,
//       allCategory
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal Server Error');
//   }
// }



async function loadProducts(req, res) {
  try {
    const allCategory = await Category.distinct('name');
    const brands = await Product.distinct('brand');
    const categories = await Category.find({is_list:true});
    const user = req.session.user_id
    const selectedCategory = req.query.category;
    const selectedBrand = req.query.brand;
    const searchQuery = req.query.q;

    const sortBy = req.query.sortby || 'priceLowToHigh';

    let sortQuery = {};
    if (sortBy === 'priceLowToHigh') {
      sortQuery = { discountPrice: 1 };
    } else if (sortBy === 'priceHighToLow') {
      sortQuery = { discountPrice: -1 };
    }

    const page = parseInt(req.query.page, 10) || 1;
    const productsPerPage = 4; 

    const filter = {};
    if (selectedCategory) {
      const selectedCategoryName = await Category.findOne({ name: selectedCategory });
      filter['category'] = selectedCategoryName._id;
    }
    if (selectedBrand) {
      filter['brand'] = selectedBrand;
    }
    if (searchQuery) {
      // Use regex for case-insensitive search
      filter['$or'] = [
        { name: { $regex: new RegExp(searchQuery, 'i') } },
        { brand: { $regex: new RegExp(searchQuery, 'i') } },
        { category: { $in: await Category.find({ name: { $regex: new RegExp(searchQuery, 'i') } }).distinct('_id') } },
      ];
    }

    const results = await async.parallel({
      productdata: async function () {
        return Product.find(filter)
          .sort(sortQuery)
          .skip((page - 1) * productsPerPage)
          .limit(productsPerPage)
          .exec();
      },
      totalProducts: async function () {
        return Product.countDocuments().exec();
      },
    });

    const { productdata, totalProducts } = results;


    res.render('productsView', {
      productdata,
      categories,
      brands,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / productsPerPage),
      user,
      allCategory,
      sortBy
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
}


// const loadProductsView = async (req, res) => {
//   try {
//     const allCategory = await Category.distinct('name');
//     const brands = await Product.distinct('brand');
//     const categories = await Category.find();
//     const user = req.session.user_id;
//     const cartQuantity = req.session.cartQuantity; 

//     const selectedCategory = req.query.category;
//     const selectedBrand = req.query.brand;
//     const searchQuery = req.query.q;
   

//     const sortBy = req.query.sortby || 'priceLowToHigh';

//     let sortQuery = {};
//     if (sortBy === 'priceLowToHigh') {
//       sortQuery = { sales_price: 1 };
//     } else if (sortBy === 'priceHighToLow') {
//       sortQuery = { sales_price: -1 };
//     }

//     // Build filter based on selected category, brand, and search query
//     const filter = {};
//     if (selectedCategory) {
//       filter['category'] = selectedCategory;
//     }
//     if (selectedBrand) {
//       filter['brand'] = selectedBrand;
//     }
//     if (searchQuery) {
//       // Use regex for case-insensitive search
//       filter['$or'] = [
//         { title: { $regex: new RegExp(searchQuery, 'i') } },
//         { category: { $regex: new RegExp(searchQuery, 'i') } },
//         { brand: { $regex: new RegExp(searchQuery, 'i') } },
//       ];
//     }
//     filter['is_Listed'] = true; // Include only listed products

//     // Pagination parameters
//     const page = parseInt(req.query.page, 10) || 1;
//     const productsPerPage = 12;

//     const results = await Promise.all([
//       Product.find(filter)
//         .sort(sortQuery)
//         .skip((page - 1) * productsPerPage)
//         .limit(productsPerPage)
//         .exec(),
//       Product.countDocuments(filter).exec(),
//     ]);

//     const [productdata, totalProducts] = results;

//     // Render your view with the fetched productdata, categories, brands, and pagination information
//     res.render('productsView', {
//       productdata,
//       categories,
//       brands,
//       currentPage: page,
//       totalPages: Math.ceil(totalProducts / productsPerPage),
//       allCategory,
//       user,
//       selectedCategory,
//       selectedBrand,
//       searchQuery,
//       sortBy,
//       cartQuantity
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Internal Server Error');
//   }
// };


//pagination
async function loadProduct(req, res) {
  try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 5; // Adjust this value based on the number of products you want to display per page

      const totalCount = await Product.countDocuments();
      const totalPages = Math.ceil(totalCount / perPage);

      const products = await Product.find()
          .skip((page - 1) * perPage)
          .limit(perPage);
    const successMessage = req.session.successmessage;
    delete req.session.successmessage;
    const editproduct = req.session.successMessage;
    delete req.session.successMessage;
      res.render('products', { products, currentPage: page, totalPages , successMessage , editproduct , confirmList: true});
      
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
  }
}



const loadaddnewProduct = async(req,res) =>{
    try {
        const allCategory = await Category.find({is_list:true})
        res.render('addnewProduct',{allCategory , errorMessage:""})
    } catch (error) {
        console.log(error.message);
    }
}


async function editProduct(req,res){
  try {
    const productId = req.query.id;
    const category=await Category.find();

    
    const product = await Product.findById(productId);
 
    req.session.successMessage = 'Product successfully edited'
  
    
    res.render('editProduct',{product,category});
   
  } catch (error) {
    console.log(error.message);
  }
}




async function addnewProduct(req, res) {
  try {

    const { discountPercentage, price, category } = req.body;
    let offerPrice = 0;
    let discountAmount = 0;

    const filteredCategory = await Category.findById({ _id: category });
    console.log(filteredCategory);

    if (filteredCategory.offer > 0 ||filteredCategory.offer > discountPercentage ) {
        offerPrice = (price * filteredCategory.offer) / 100;
        console.log(offerPrice);
        discountAmount = price - offerPrice;
        console.log(discountAmount);
    } else {
      offerPrice = (price * discountPercentage) / 100;
      console.log(offerPrice);
      discountAmount = price - offerPrice;
      console.log(discountAmount);
    }
   

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      model: req.body.model,
      screenSize: req.body.screenSize,
      price: req.body.price,
      quantity: req.body.quantity,
      discountPrice:discountAmount,
      brand: req.body.brand,
      ram: req.body.ram,
      storage: req.body.storage,
      processor: req.body.processor,
      category: req.body.category,
      graphicsCard: req.body.graphicsCard,
      osArchitecture: req.body.osArchitecture,
      os: req.body.os,
      list: true
    });

    if (req.files && req.files.length > 0) {
      product.productImage = req.files.map((file) => file.filename);
    }

  
    await product.save();

    req.session.successmessage = 'Product added successfully';
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error.message);
    // res.status(500).send('Internal Server Error');
    const allCategory = await Category.find({is_list:true})
    res.render('addnewProduct', { errorMessage: 'Internal Server Error' , allCategory});
  }
}




// Assuming that Product is a mongoose model defined somewhere in your code
// async function listProduct(req, res) {
//   try {
//     const productId = req.query.id;
//     const product = await Product.findById(productId);

//     if (!product) {
//       console.log("Product not found");
//       return res.redirect('/admin/products');
//     }

//     // Toggle the 'list' property
//     product.list = !product.list;

//     // Save the changes
//     await product.save();

//     res.redirect('/admin/products');
//   } catch (error) {
//     console.log(error.message);
//     res.redirect('/admin/products');
//   }
// }
async function listProduct(req, res) {
  try {
    const productId = req.query.id;
    const product = await Product.findById(productId);

    if (!product) {
      console.log("Product not found");
      return res.redirect('/admin/products');
    }

    // Toggle the 'list' property
    product.list = !product.list;

    // Save the changes
    await product.save();

    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message);
    res.redirect('/admin/products');
  }
}


const updateProduct = async (req, res) => {
  try {
      const productId = req.query.id;
      const {
          name,
          description,
          model,
          screenSize,
          price,
          discountPrice,
          quantity,
          brand,
          ram,
          storage,
          processor,
          category,
          graphicsCard,
          osArchitecture,
          os
      } = req.body;

      // Handle image update if a new image is provided
      if (req.files && req.files.length > 0) {
          // Assuming the productImages field in your Product model is an array
          const imagePaths = req.files.map((file) => file.filename);
          
          // Update the product details along with productImages
          const updatedProduct = await Product.findByIdAndUpdate(
              { _id: productId },
              {
                  name,
                  description,
                  model,
                  screenSize,
                  price,
                  discountPrice,
                  quantity,
                  brand,
                  ram,
                  storage,
                  processor,
                  category,
                  graphicsCard,
                  osArchitecture,
                  os,
                  productImage: imagePaths
              },
              { new: true }
          );

          if (updatedProduct) {
              console.log('Product Updated:', updatedProduct);
          } else {
              console.log('Product not found or update failed.');
          }
      } else {
          // If no new image is provided, update other fields without changing productImages
          const updatedProduct = await Product.findByIdAndUpdate(
              { _id: productId },
              {
                  name,
                  description,
                  model,
                  screenSize,
                  price,
                  discountPrice,
                  quantity,
                  brand,
                  ram,
                  storage,
                  processor,
                  category,
                  graphicsCard,
                  osArchitecture,
                  os
              },
              { new: true }
          );

          if (updatedProduct) {
              console.log('Product Updated:', updatedProduct);
          } else {
              console.log('Product not found or update failed.');
          }
      }

      res.redirect('/admin/products');
  } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
  }
};



module.exports = {
    loadProduct,
    loadaddnewProduct,
    addnewProduct,
    listProduct,
    editProduct,
   updateProduct,
   loadProducts

}