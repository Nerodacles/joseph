const { json } = require('body-parser');
let express = require('express');
let router = express.Router();
const Model = require('../models/model');
const auth = require('../helpers/jwt');
let multer = require('multer');
let fs = require('fs-extra');
let path = require('path');
let userServices = require('../services/userService');

function generateName(coverName){
    return coverName.trim();
}

let storage = multer.diskStorage({
    limits: {fileSize: 1000000},
    destination: (req, file, cb) => {
        let path = 'uploads';
        fs.mkdirsSync(path);
        cb(null, path) },
    filename: (req, file, cb) => {
        cb(null, generateName(file.originalname)) }
});

let upload = multer({ storage: storage, limits: {fileSize: 1000000} });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/docs')
});

/**
* @swagger
* /api/inventory:
*   get:
*     tags:
*       - Inventory
*     security: []
*     summary: Get all items in inventory
*     description: Get all items in inventory
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             name:
*               type: string
*               description: Name of the drug
*             price:
*               type: number
*               description: Price of the drug
*             quantity:
*               type: number
*               description: Quantity of the drug
*             provider:
*               type: string
*               description: Provider of the drug
*             image:
*               type: string
*               description: Image of the drug
*             date:
*               type: string
*               description: Date of the drug
*             id:
*               type: string
*               description: Id of the drug
*           example:
*             - id: 62ae1de392d3f0b8a6
*               name: Juanma
*               quantity: 1
*               price: 1
*               provider: Joseph
*               date: 2021-03-01T00:00:00.000Z
*               image: https://pharmacyapi.jmcv.codes/uploads/imagen.jpg
*             - id: 62ae1de392d3f0b8a6
*               name: Joseph
*               quantity: 1
*               price: 1
*               provider: Juanma
*               date: 2021-03-01T00:00:00.000Z
*               image: https://pharmacyapi.jmcv.codes/uploads/imagen.jpg
*               
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*/


router.get('/inventory', async (req, res, next) => {
    try {
        content = await Model.find({});
        res.json(content);
    }
    catch (error) {
        next(error);
    }
});

/**
* @swagger
* /api/inventory/{id}:
*   get:
*     tags:
*       - Inventory
*     security: []
*     summary: Get item in inventory by id
*     description: Get item in inventory by id
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: Id of the drug
*         in: path
*         required: true
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             name:
*               type: string
*               description: Name of the drug
*             price:
*               type: number
*               description: Price of the drug
*             quantity:
*               type: number
*               description: Quantity of the drug
*             provider:
*               type: string
*               description: Provider of the drug
*             image:
*               type: string
*               description: Image of the drug
*             date:
*               type: string
*               description: Date of the drug
*             id:
*               type: string
*               description: Id of the drug
*           example:
*             - id: 62ae1de392d3f0b8a6
*               name: Juanma
*               quantity: 1
*               price: 1
*               provider: Joseph
*               date: 2021-03-01T00:00:00.000Z
*               image: https://pharmacyapi.jmcv.codes/uploads/imagen.jpg
*               
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*/

router.get('/inventory/:id', async (req, res, next) => {
    try {
        content = await Model.findById(req.params.id);
        res.json(content);
    }
    catch (error) {
        next(error);
    }
});

/**
* @swagger
* /api/inventory:
*   post:
*     tags:
*       - Inventory
*     security:
*       - ApiKeyAuth: []
*     summary: Add a new item to inventory
*     description: Add a new item to inventory
*     consumes:
*       multipart/form-data
*     produces:
*       application/json
*     parameters:
*       - name: name
*         in: formData
*         description: Name of the item
*         required: true
*         type: string
*         default: Joseph
*       - name: price
*         in: formData
*         description: Price of the item
*         required: true
*         type: number
*         default: 10
*       - name: quantity
*         in: formData
*         description: Quantity of the item
*         required: true
*         type: number
*         default: 10
*       - name: provider
*         in: formData
*         description: Provider of the item
*         required: true
*         type: string
*         default: Juanma
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             name:
*               type: string
*               description: Name of the drug
*             price:
*               type: number
*               description: Price of the drug
*             quantity:
*               type: number
*               description: Quantity of the drug
*             provider:
*               type: string
*               description: Provider of the drug
*             image:
*               type: string
*               description: Image of the drug
*             date:
*               type: string
*               description: Date of the drug
*             id:
*               type: string
*               description: Id of the drug
*           example:
*             - id: 62ae1de392d3f0b8a6
*               name: Juanma
*               quantity: 1
*               price: 1
*               provider: Joseph
*               date: 2021-03-01T00:00:00.000Z
*               image: https://pharmacyapi.jmcv.codes/uploads/imagen.jpg
*             - id: 62ae1de392d3f0b8a6
*               name: Joseph
*               quantity: 1
*               price: 1
*               provider: Juanma
*               date: 2021-03-01T00:00:00.000Z
*               image: https://pharmacyapi.jmcv.codes/uploads/imagen.jpg
*               
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*/

router.post('/inventory', async (req, res, next) => {
    let token = req.headers.authorization;
    if (await userServices.checkUserIsAdmin(token)) {
        try {
            const item = new Model({
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                provider: req.body.provider,
                image: 'ioc no sirve'
            })
            await item.save();
            res.json(item);
        }
        catch (error) {
            next(error);
        }
    }
    else {
        res.sendStatus(401);
    }
});

/**
* @swagger
* /api/inventory/{id}:
*   delete:
*     tags:
*       - Inventory
*     security:
*       - ApiKeyAuth: []
*     summary: Delete a item from inventory
*     description: Delete a item from inventory
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: id
*         description: Drug id
*         required:
*           - id
*         properties:
*           id:
*             type: string
*             description: Id of the drug
*     responses:
*       200:
*         description: deleted
*         schema:
*           type: string
*           example: Deleted
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*/


router.delete('/inventory/:id', async (req, res, next) => {
    let token = req.headers.authorization;
    if (await userServices.checkUserIsAdmin(token)) {
        try {
            const item = await Model.findByIdAndDelete(req.params.id);
            res.sendStatus(200).json({ message: 'Deleted' });
        }
        catch (error) {
            next(error);
        }
    }
    else {
        res.sendStatus(401);
    }
});

/**
* @swagger
* /api/inventory/{id}:
*   patch:
*     tags:
*       - Inventory
*     security:
*       - ApiKeyAuth: []
*     summary: Update a item from inventory
*     description: Update a item from inventory
*     consumes:
*       multipart/form-data
*     produces:
*       application/json
*     parameters:
*       - in: path
*         name: id
*         description: item id
*         required: true
*       - name: name
*         in: formData
*         description: Name of the item
*         required: true
*         type: string
*         default: Joseph
*       - name: price
*         in: formData
*         description: Price of the item
*         required: true
*         type: number
*         default: 10
*       - name: quantity
*         in: formData
*         description: Quantity of the item
*         required: true
*         type: number
*         default: 10
*       - name: provider
*         in: formData
*         description: Provider of the item
*         required: true
*         type: string
*         default: Juanma
*     responses:
*       200:
*         description: Success
*         schema:
*           type: object
*           properties:
*             name:
*               type: string
*               description: Name of the drug
*             price:
*               type: number
*               description: Price of the drug
*             quantity:
*               type: number
*               description: Quantity of the drug
*             provider:
*               type: string
*               description: Provider of the drug
*             image:
*               type: string
*               description: Image of the drug
*             date:
*               type: string
*               description: Date of the drug
*             id:
*               type: string
*               description: Id of the drug
*           example:
*             - id: 62ae1de392d3f0b8a6
*               name: Juanma
*               quantity: 1
*               price: 1
*               provider: Joseph
*               date: 2021-03-01T00:00:00.000Z
*               image: https://pharmacyapi.jmcv.codes/uploads/imagen.jpg
*             - id: 62ae1de392d3f0b8a6
*               name: Joseph
*               quantity: 1
*               price: 1
*               provider: Juanma
*               date: 2021-03-01T00:00:00.000Z
*               image: https://pharmacyapi.jmcv.codes/uploads/imagen.jpg
*               
*       400:
*         description: Bad request
*       401:
*         description: Unauthorized
*/

router.patch('/inventory/:id', async (req, res, next) => {
    let token = req.headers.authorization;
    if (await userServices.checkUserIsAdmin(token)) {
        try {
            const item = await Model.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.json(item);
        }
        catch (error) {
            next(error);
        }
    }
    else {
        res.sendStatus(401);
    }
});

module.exports = router;
module.exports.Model = Model;