const responseHelper = require('../helpers/response');
const { CATEGORY } = require('../helpers/responseMessage');
const category = require('../services/categoryService');

const create = async (req, res, next) => {
    try {
        const { body, params } = req;
        const result = await category.create(body, params);

        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, CATEGORY.CREATED_SUCCESS);
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
        const result = await category.viewById(body, params, info);

        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, CATEGORY.FETCH_SUCCESS, result.data);
        }
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
};

const update = async (req, res, next) => {
    try {
        const { body, params } = req;

        const result = await category.update(body, params);
        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, CATEGORY.UPDATED_SUCCESS);
        }
    } catch (e) {
        return responseHelper.serverError(res, e);
    }
};

const deleteById = async (req, res, next) => {
    try {
        const { body, params } = req;

        const result = await category.deleteById(body, params);
        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, CATEGORY.DELETED_SUCCESS);
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
        const result = await category.list(body, params, info);
        if (result.error) {
            return responseHelper.badRequestError(res, result.message);
        } else {
            return responseHelper.success(res, CATEGORY.FETCH_SUCCESS, { result: result.data, totalRows: result.totalRows, currentPage: result.currentPage, totalPages: result.totalPages });
        }
    } catch (error) {
        return responseHelper.serverError(res, error);
    }
};

module.exports = { create, viewById, update, deleteById, list };