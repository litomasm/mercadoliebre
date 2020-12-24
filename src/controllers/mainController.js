const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const visited = products.filter((product) => {
			return product.category == 'visited';
		});
		const inSale = products.filter((product) => {
			return product.category == 'in-sale';
		});

		res.render('index', {
			visitedProducts: visited,
			inSaleProducts: inSale
		});
	},
	search: (req, res) => {
		const searched = req.query.keywords;
		const foundProduct = Product.findAll(product => product.name.toLowerCase().includes(searched))

		res.render('results', {
			product: foundProduct
		})
},
};

module.exports = controller;
