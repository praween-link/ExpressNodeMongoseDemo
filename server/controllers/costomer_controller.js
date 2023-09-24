
const mongoose = require('mongoose');
const CustomerModel = require('../models/costomer_model');

/*
- GET /
- Home Page
*/

exports.homePage = async (req, resp) => {
    const messages = await req.flash('info');
    console.log(messages);
    const locals = {
        title: "User Mgm",
        description: "This is user mgs description."
    }

    let perPage = 12;
    let page = req.query.page || 1;

    try{
        const customers = await CustomerModel.aggregate([{ $sort: { updatedAt: -1 } }])
        .skip(perPage*page - perPage).limit(perPage).exec();
        const count = await CustomerModel.count();
        
        resp.render('index', { locals, messages, customers, currentPage: page, pages: Math.ceil(count/perPage) });
    } catch(error){
        console.log(error);
    } 
}

// exports.homePage = async (req, resp) => {
//     const messages = await req.flash('info');
//     console.log(messages);
//     const locals = {
//         title: "User Mgm",
//         description: "This is user mgs description."
//     }
//     try{
//         const customers = await CustomerModel.find({}).limit(20);
//         console.log(customers);
//         resp.render('index', { locals, messages, customers });
//     } catch(error){
//         console.log(error);
//     } 
// }

/*
- GET /
- Add New Customer
*/
exports.addNewCustomer = async (req, resp) => {
    const locals = {
        title: "Add New Customer",
        description: "This is add new customer description."
    }
    resp.render('customer/add', locals); //{locals}
}

/*
- POST /
- Create New Customer
*/
exports.postNewCustomer = async (req, resp) => {
    
    // console.log(req.body);

    const newCustomer = new CustomerModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        details: req.body.customerDetails,
        status: Math.floor(Math.random() * (5 - 0) + 0),
    });


    // const locals = {
    //     title: "New Customer Added!",
    //     description: "This is add new customer description."
    // }
    // resp.render('customer/add', locals);

    try{
        await CustomerModel.create(newCustomer);
        // Set a flash message
        req.flash('info', 'New customer added successfully!');

        resp.redirect('/');
    } catch(error){
        console.log(error);
    }
}


/*
- GET /
- Customer Details View
*/

exports.customerDetailsView = async (req, resp) => {
    const messages = await req.flash('info');
    // console.log(`Flash Message==> ${messages}`);
    const locals = {
        title: "Customer Details",
        description: "This is user mgs description."
    }

    try{
        const customerDetails = await CustomerModel.findById(req.params.id);
        // const customersCount = await CustomerModel.count();
    // console.log(`Flash Message==> ${customerDetails}`);
        
        resp.render('customer/view', { locals, messages, customerDetails });
    } catch(error){
        console.log(error);
    } 
}

/*
- GET /
- Edit Customer
*/

exports.editCustomer = async (req, resp) => {
    const messages = await req.flash('info');
    console.log(req.originalUrl);
    const locals = {
        title: "Customer Details",
        description: "This is user mgs description."
    }

    try{
        const customerDetails = await CustomerModel.findById(req.params.id);
        // const customersCount = await CustomerModel.count();
        
        resp.render('customer/edit', { locals, messages, customerDetails });
    } catch(error){
        console.log(error);
    } 
}

/*
- POST /
- Edit Customer
*/

exports.editCustomerPost = async (req, resp) => {

    try{
        await CustomerModel.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            details: req.body.customerDetails,
            updatedAt: Date.now()
        });
        // Set a flash message
        req.flash('info', 'Customer info updated successfully!');
        resp.redirect(`/view/${req.params.id}`);
    } catch(error){
        console.log(error);
    }
}

/*
- POST /
- Edit Customer
*/

exports.deleteCustomer = async (req, resp) => {
    try{
        await CustomerModel.findByIdAndDelete(req.params.id);
        // Set a flash message
        req.flash('info', 'Customer deleted successfully!');
        resp.redirect(`/`);
    } catch(error){
        console.log(error);
    }
}


/*
- POST /
- Search
*/

exports.searchHome = async (req, resp) => {
    console.log(`Search: ${req.body}, ${req.body.search}`);
    const messages = await req.flash('info');
    console.log(messages);
    const locals = {
        title: "User Mgm Searched",
        description: "This is user mgs description."
    }
    
    try{
        const query = {};
        // if(req.body.status){
        //     query.status = req.body.status;
        // }
        if(req.body.search){
            const key = req.body.search.replace(/[^a-zA-Z0-9]/g, "");
            query.$or = [
                {"firstName": {$regex: key + '.*', '$options': 'i'}},
                {"lastName": {$regex: key + '.*', '$options': 'i'}}
            ];
        }
        let customers = await CustomerModel.find(query);
        
        resp.render('index', { locals, messages, customers});
    }catch(error){
        console.log(error);
    }

    
}


/* ================================= API =============================================
- POST /
- Search
*/

exports.search = async (req, resp) => {
    if(req.body.status){
        
    console.log(`Search: ${req.body.search_key}, ${req.body.status}`);

    }
    
    try{
        const query = {};
        if(req.body.status){
            query.status = req.body.status;
        }
        if(req.body.search_key){
            const key = req.body.search_key.replace(/[^a-zA-Z0-9]/g, "");
            query.$or = [
                
                {"firstName": {$regex: key + '.*', '$options': 'i'}},
                {"lastName": {$regex: key + '.*', '$options': 'i'}}
            ];
        }
        let data = await CustomerModel.find(query);
        
        resp.send(data);
    }catch(error){
        resp.send(error);
    }
}