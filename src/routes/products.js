// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../public/images/products/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/
router.get('/', productsController.index);

/*** CREATE ONE PRODUCT ***/
router.get('/create', productsController.create);
router.post('/create', upload.any(), productsController.store);


/*** GET ONE PRODUCT ***/
router.get('/detail/:id/', productsController.detail); // http://localhost:3000/products/detail/6

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:id', productsController.edit);
router.put('/edit/:id', upload.any(), productsController.update);


/*** DELETE ONE PRODUCT***/
router.delete('/:id', productsController.destroy);


module.exports = router;
