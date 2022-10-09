const domain = require('../domain/services/domain-service.js');

/**
 * Controller function to get keys
 * */
const getKeys = async (req, res) => {
    res.render('index', await domain.getKeys());
};

/**
 * Controller function to set key
 * */
const setKey = async (req, res) => {
    await domain.setKey(req);
    res.redirect('/');
};

/**
 * Controller function to delete key
 * */
const deleteKey = async (req, res) => {
    await domain.deleteKey(req);
    res.redirect('/');
};

/**
 * Available functions
 * */
module.exports = {getKeys, setKey, deleteKey};