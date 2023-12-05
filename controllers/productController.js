const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { model } = require('mongoose');
const path = require('path')
const uploads = require('../helper/multer')
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs-extra');



const async = require('async');



async function loadProducts(req, res) {
  try {
    const brands = await Product.distinct('brand');
    const categories = await Category.find({is_list:true});
    const user = req.session.user_id

    // Get the current page from the query parameters, default to 1 if not provided
    const page = parseInt(req.query.page, 10) || 1;
    const productsPerPage = 4; // Number of products per page

    // Use async.parallel to fetch productdata and totalProducts concurrently
    const results = await async.parallel({
      productdata: async function () {
        return Product.find({list:true})
          .skip((page - 1) * productsPerPage)
          .limit(productsPerPage)
          .exec();
      },
      totalProducts: async function () {
        return Product.countDocuments().exec();
      },
    });

    const { productdata, totalProducts } = results;

    // Render your view with the fetched productdata, categories, brands, and pagination information
    res.render('productsView', {
      productdata,
      categories,
      brands,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / productsPerPage),
      user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
}



//pagination
async function loadProduct(req, res) {
  try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 10; // Adjust this value based on the number of products you want to display per page

      const totalCount = await Product.countDocuments();
      const totalPages = Math.ceil(totalCount / perPage);

      const products = await Product.find()
          .skip((page - 1) * perPage)
          .limit(perPage);

      res.render('products', { products, currentPage: page, totalPages });
      
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

    
    res.render('editProduct',{product,category})
  } catch (error) {
    console.log(error.message);
  }
}







// async function addnewProduct(req, res) {
//   try {
//     const product = new Product({
//       name: req.body.name,
//       description: req.body.description,
//       model: req.body.model,
//       screenSize: req.body.screenSize,
//       price: req.body.price,
//       discountPrice: req.body.discountPrice,
//       quantity: req.body.quantity,
//       brand: req.body.brand,
//       ram: req.body.ram,
//       storage: req.body.storage,
//       processor: req.body.processor,
//       category: req.body.category,
//       graphicsCard: req.body.graphicsCard,
//       osArchitecture: req.body.osArchitecture,
//       os: req.body.os,
//       list: true
//     });

//     if (req.files && req.files.length > 0) {
//       product.productImage = req.files.map((file) => file.filename);
//     }

//         // Create a temporary directory for resized images
//         const tempDir = path.join(__dirname, "temp");
//         await fs.mkdir(tempDir, { recursive: true });

//         // Resize and crop the uploaded images to 277x277
//         await Promise.all(product.productImage.map(async (filename) => {
//             const inputImagePath = `./public/productImage/${filename}`;
//             const outputImagePath = path.join(tempDir, filename);

//             await sharp(inputImagePath)
//                 .resize({ width: 1000, height: 1000, fit: 'cover' })
//                 .toFile(outputImagePath);
//         }));

//         // Move the resized images back to the original directory
//         await Promise.all(product.productImage.map(async (filename) => {
//             const tempImagePath = path.join(tempDir, filename);
//             const finalImagePath = `./public/productImage/${filename}`;

//             await fs.rename(tempImagePath, finalImagePath);
//         }));

//         // Remove the temporary directory
//         await fs.rmdir(tempDir, { recursive: true });

//         console.log("Success");
//     await product.save();
//     res.redirect('/admin/products');
//   } catch (error) {
//     console.error(error.message);
//   //   res.status(500).send('Internal Server Error');
//   const allCategory = await Category.find({is_list:true})
//     res.render('addnewProduct', { errorMessage: 'Internal Server Error' , allCategory});
//    }
// }

async function addnewProduct(req, res) {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      model: req.body.model,
      screenSize: req.body.screenSize,
      price: req.body.price,
      discountPrice: req.body.discountPrice,
      quantity: req.body.quantity,
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

    console.log("Success");
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error.message);
    // res.status(500).send('Internal Server Error');
    const allCategory = await Category.find({is_list:true})
    res.render('addnewProduct', { errorMessage: 'Internal Server Error' , allCategory});
  }
}



// Assuming that Product is a mongoose model defined somewhere in your code
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

// const updateProduct = async (req, res) => {
//   try {
//       const productId = req.query.id;
//       const {
//           name,
//           description,
//           model,
//           screenSize,
//           price,
//           discountPrice,
//           quantity,
//           brand,
//           ram,
//           storage,
//           processor,
//           category,
//           graphicsCard,
//           osArchitecture,
//           os
//       } = req.body;

//       // Handle image update if a new image is provided
//       if (req.files && req.files.length > 0) {
//           // Assuming the productImages field in your Product model is an array
//           const imagePaths = req.files.map((file) => file.filename);
          
//           // Update the product details along with productImages
//           const updatedProduct = await Product.findByIdAndUpdate(
//               { _id: productId },
//               {
//                   name,
//                   description,
//                   model,
//                   screenSize,
//                   price,
//                   discountPrice,
//                   quantity,
//                   brand,
//                   ram,
//                   storage,
//                   processor,
//                   category,
//                   graphicsCard,
//                   osArchitecture,
//                   os,
//                   productImage: imagePaths
//               },
//               { new: true }
//           );

//           if (updatedProduct) {
//               console.log('Product Updated:', updatedProduct);
//           } else {
//               console.log('Product not found or update failed.');
//           }
//       } else {
//           // If no new image is provided, update other fields without changing productImages
//           const updatedProduct = await Product.findByIdAndUpdate(
//               { _id: productId },
//               {
//                   name,
//                   description,
//                   model,
//                   screenSize,
//                   price,
//                   discountPrice,
//                   quantity,
//                   brand,
//                   ram,
//                   storage,
//                   processor,
//                   category,
//                   graphicsCard,
//                   osArchitecture,
//                   os
//               },
//               { new: true }
//           );

//           if (updatedProduct) {
//               console.log('Product Updated:', updatedProduct);
//           } else {
//               console.log('Product not found or update failed.');
//           }
//       }

//       res.redirect('/admin/products');
//   } catch (error) {
//       console.log(error.message);
//       res.status(500).send('Internal Server Error');
//   }
// };

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

      // Create a temporary directory for resized images
      const tempDir = path.join(__dirname, "temp");
      await fs.mkdir(tempDir, { recursive: true });

      // Resize and crop the uploaded images to 277x277
      await Promise.all(imagePaths.map(async (filename) => {
        const inputImagePath = `./public/productImage/${filename}`;
        const outputImagePath = path.join(tempDir, filename);

        await sharp(inputImagePath)
          .resize({ width: 277, height: 277, fit: 'contain' })
          .toFile(outputImagePath);
      }));

      // Move the resized images back to the original directory
      await Promise.all(imagePaths.map(async (filename) => {
        const tempImagePath = path.join(tempDir, filename);
        const finalImagePath = `./public/productImage/${filename}`;

        await fs.rename(tempImagePath, finalImagePath);
      }));

      // Remove the temporary directory
      await fs.rmdir(tempDir, { recursive: true });

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
        // console.log('Product Updated:', updatedProduct);
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
        // console.log('Product Updated:', updatedProduct);
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