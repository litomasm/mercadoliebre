const express = require('express');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../public/images/users/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

const authMiddleware = require("../middleware/authMidddleware");

const userController = require('../controllers/userController');

// Muestra la vista de registro
router.get('/register', userController.showRegister);


// Procesa la vista de registro
router.post('/register', upload.any(), userController.processRegister);

// Muestra la vista de login
router.get('/login', userController.showLogin);

// Procesa la vista de login
router.post('/login', userController.processLogin);

// Muestra el perfil del usuario
router.get('/profile', authMiddleware, userController.showProfile);

// Cierra la sesión
router.get('/logout', userController.logout);

module.exports = router;