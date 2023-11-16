const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { model } = require('mongoose');
const path = require('path')
const uploads = require('../helper/multer')


async function loadProduct (req,res){
    try {

        const productdata = await Product.find()
        res.render('products',{productdata})
        console.log(productdata);
    } catch (error) {
        console.log(error.message);
    }
}


const loadaddnewProduct = async(req,res) =>{
    try {
        const allCategory = await Category.find()
        res.render('addnewProduct',{allCategory})
    } catch (error) {
        console.log(error.message);
    }
}


async function editProduct(req,res){
  try {
    const productId = req.query.id;
    const category=await Category.find();

    console.log(productId);
    const product = await Product.findById(productId);

    console.log(category);
    res.render('editProduct',{product,category})
  } catch (error) {
    console.log(error.message);
  }
}


//gpt
// async function addnewProduct(req, res) {
//   try {
//     const productId = req.query._id;

//     const productdata = await Product.findById(productId);
//     if (!productdata) {
//       return res.render('editProduct', { message: "Product not found", product: {} });
//       // Changed 'product' to '{}', assuming you want to pass an empty object to the view
//     }

//     const product = {
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
//       graphicsCard: req.body.graphicsCard, // Fixed key name here
//       osArchitecture: req.body.osArchitecture,
//       os: req.body.os,
//       list: true
//     };

//     console.log(product);

//     if (req.file && req.file.length > 0) {
//       product.productImages = req.files.map((file) => file.filename);
//       // Changed 'productdata' to 'product' here
//     }

//     console.log(product);

//     const updated = await Product.insertMany(product);
//     console.log(updated);
//     res.redirect('/admin/products');
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send('Internal Server Error');
//   }
// }

async function addnewProduct(req, res) {

  try {

    console.log("/////////////"+req.body.category);

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

    console.log(product);

    if (req.files && req.files.length > 0) {
      product.productImage = req.files.map((file) => file.filename);
    }

    console.log(product);

    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
}



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
                  productImages: imagePaths
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
   updateProduct

}