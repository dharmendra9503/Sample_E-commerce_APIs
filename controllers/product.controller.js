const responseHelper = require('../helpers/response');
const { PRODUCT } = require('../helpers/responseMessage');
const product = require('../services/productService');

const welcome = (req, res, next) => {
    try {
        return responseHelper.success(res, "Welcome Dharmendra Prajapati");
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
}

const create = async (req, res, next) => {
    try {
        const { body, params } = req;
        const result = await product.create(body, params);

        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, PRODUCT.CREATED_SUCCESS);
        }
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
};

const viewById = async (req, res, next) => {
    try {
        const { body, params } = req;
        const info = {
            productId: params || null
        };
        const result = await product.viewById(body, params, info);

        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, PRODUCT.FETCH_SUCCESS, result.data);
        }
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
};

const update = async (req, res, next) => {
    try {
        const { body, params } = req;

        const result = await product.update(body, params);
        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, PRODUCT.UPDATED_SUCCESS);
        }
    } catch (e) {
        return responseHelper.serverError(res, e);
    }
};

const deleteById = async (req, res, next) => {
    try {
        const { body, params } = req;

        const result = await product.deleteById(body, params);
        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, PRODUCT.DELETED_SUCCESS);
        }
    } catch (e) {
        return responseHelper.serverError(res, error);
    }
};

const list = async (req, res, next) => {
    try {
        const { body, params } = req;
        const info = {
            queryData: req.query
        };
        const result = await product.list(body, params, info);
        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, PRODUCT.FETCH_SUCCESS, { result: result.data, totalRows: result.totalRows, currentPage: result.currentPage, totalPages: result.totalPages });
        }
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
};

module.exports = { welcome, create, viewById, update, deleteById, list };