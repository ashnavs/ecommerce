const PDFDocument = require('pdfkit')

const generateSalesReport = (orders, res) => {
    const doc = new PDFDocument();
    doc.text('Sales Report', { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();
    let orderCounter = 0;
    orders.forEach((order) => {
        doc.text(`Order ID: ORD${String(order._id.toString()).padStart(5, '0')}`, { fontSize: 12 });
        doc.text(`Customer Name: ${order.user.name ? order.user.name : 'N/A'}`, { fontSize: 12 });

        const totalPrice = order.products.reduce((sum, product) => sum + product.total, 0);

        doc.text(`Price: ₹${totalPrice}`, { fontSize: 12 });
        doc.text(`Status: ${order.status}`, { fontSize: 12 });
        doc.text(`Date: ${order.createdAt ? order.createdAt.toLocaleDateString() : 'N/A'}`, { fontSize: 12 });
        doc.moveDown();
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
    doc.pipe(res);
    doc.end();
};

module.exports = {
    generateSalesReport
}