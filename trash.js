const salesReoprt = async(req, res)=>{
    try {
        const report = await Order.aggregate([
            {
                $match:{
                    status:'Delivered',
                    paymentMethod: paymentMethod
                }
            },
            {
                $unwind:'$products'
            },
            {
                $lookup:{
                    from: 'products',
                    localField:'products.product',
                    foreignField:'_id',
                    as:'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $lookup:{
                    from:'categories',
                    localField:'productDetails.Category',
                    foreignField:'_id',
                    as: 'productDetailsCategory'
                }
            },
            {
                $unwind: '$productDetailsCategory'
            },
            {
                $lookup:{
                    from:'users',
                    localField:'user',
                    foreignField:'_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind:'userDetails'
            },
            {
                $project:{
                    createdAt:1,
                    'userDetails.name':1,
                    'productDetails.name':1,
                    'productDetailsCategory.name':1,
                    'products.discountPrice': 1,
                    'products.quantity': 1,
                    paymentMethod: 1,
                    'products.quantity': 1,
                }
            }

        ])
    } catch (error) {
        console.log(error.message);
    }
}