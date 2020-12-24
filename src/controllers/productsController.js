const fs = require('fs');
const path = require('path');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const productsFilePath = path.resolve(__dirname, '../data/productsDataBase.json');

function getAllProducts(){

	const jsonProducts = fs.readFileSync(productsFilePath, 'utf-8');

	const productsParsed = JSON.parse(jsonProducts);

	return productsParsed;
}

function writeProducts(arrayToTransform) {
	const productsJson = JSON.stringify(arrayToTransform, null, " ");
	fs.writeFileSync(productsFilePath, productsJson);
}

function generateNewId(){
	const products = getAllProducts();
	return products.pop().id + 1;
}

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const products = getAllProducts();

		res.render('products', {products: products});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const id = req.params.id;
		const result = getAllProducts().find((product) => {
			return product.id == id
		})

		res.render('detail', {
			product: result
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},

	// Create -  Method to store
	store: (req, res, next) => {
		/*
			1) con req.body, obtenemos los inputs del formulario.
			2) los guardamos en una variable en forma de objeto literal.
			3) leo la base de productos. parseandola a objeto. Output: es un array con todos los objetos.
			4) agregar el objeto del punto 2 al array de productos.
			5) escribimos de nuevo todo el archivo json (base de datos) con el nuevo array (stringifiqueado) que tiene el objeto nuevo.
		*/
		const image = req.files[0].filename;
		const newProduct = {
			id: generateNewId(),
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: image
		}

		const products = getAllProducts();
		const productosAGuardar = [...products, newProduct];
		const productToStringify = JSON.stringify(productosAGuardar, null, ' ');
		fs.writeFileSync('./src/data/productsDataBase.json', productToStringify);

		res.redirect('/');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const products = getAllProducts();
			const id = req.params.id;
			const result = products.find((product) => product.id == id);

		res.render('product-edit-form', {
			productToEdit: result
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const products = getAllProducts();

		const id = req.params.id;
		
		const newProducts = products.map((product) => {

			if(id == product.id){
				product.name = req.body.name;
				product.price = req.body.price;
				product.category = req.body.category;
                product.description = req.body.description;
                product.info = req.body.info;
				product.image = req.files[0] ? req.files[0].filename : product.image;
			}

			return product;
		});

		writeProducts(newProducts);

		res.redirect("/products/detail/" + id);
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		const idProduct = req.params.id;
        const products = getAllProducts();

        const listProductUpdate = products.filter((product) =>{
            if(product.id!=idProduct){
                return product;
            }
        })

        writeProducts(listProductUpdate);

        res.redirect('/producto')


	}
	
};

module.exports = controller;