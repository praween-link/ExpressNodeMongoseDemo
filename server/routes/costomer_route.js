const express = require('express');
const router = express.Router();

const customerController = require('../controllers/costomer_controller');

router.get('/', customerController.homePage);
router.get('/add', customerController.addNewCustomer);
router.post('/add', customerController.postNewCustomer);
router.get('/view/:id', customerController.customerDetailsView);
router.get('/edit/:id', customerController.editCustomer);
router.post('/edit/:id', customerController.editCustomerPost);
router.get('/delete/:id', customerController.deleteCustomer);
router.get('/search', customerController.search);
router.post('/', customerController.searchHome);

module.exports = router;
