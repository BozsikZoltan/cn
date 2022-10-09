const axios = require('axios');
const client = axios.create({
    //baseURL: 'http://' + process.env.KEY_VALUE_STORE_HOST + ':' + process.env.KEY_VALUE_STORE_PORT
    baseURL: 'http://localhost' + ':' + 7480
});

exports.getKeys = async () => {
    return await client.get('/get').then(
        response => {
            console.log(response.data);
            return response.data;
        }
    ).catch(error => {
        console.error(error.message);
        return null;
    })
};

exports.setKey = async (key, value) => {
    await client.post('/set', {
        "key": key,
        "value": value
    }).then(
        response => {
            console.log(response.data);
        }
    ).catch(error => {
        console.error(error.message);
    });
};

exports.deleteKey = async (key) => {
    await client.post('/delete', {
        "key": key
    }).then(
        response => {
            console.log(response.data);
        }
    ).catch(error => {
        console.error(error.message);
    });
};