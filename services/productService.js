// To handle database query we can write code here
const { HTTP_STATUS_CODES, dataStatusText, pageConfig, user_type } = require('../config/status');

//This is use for ROW sql query
// const product = require('../models/product.models');
// const category = require('../models/category.models');


const categoryService = require('../services/categoryService');
const { getCurrentTimestamp } = require('../utils/date.util');
const { PRODUCT, errorMessages, CATEGORY } = require('../helpers/responseMessage');

//This is use for sequelize query
const product = require('../models/product.model.sequelize');
const category = require('../models/category.model.sequelize');


const create = async (data, params) => {
    let result = {
        error: false,
        data: {}
    };

    try {
        const existingProduct = await product.checkProductBySKU(data.sku);
        const existingCategory = await category.checkCategoryExists(data.category_id);

        if (existingProduct) {
            result.error = true;
            result.message = PRODUCT.SKU_EXISTS;
            return result;
        }

        if(existingCategory === null) {
            result.error = true;
            result.message = CATEGORY.NOT_FOUND_BY_ID;
            return result;
        }

        // Save data
        const qData = await product.create({
            sku: data.sku,
            category_id: data.category_id,
            name: data.name,
            description: data.description,
            status: stateStatus(data.status) || dataStatusText.ACTIVE,
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp()
        });

        result.data = qData;
    } catch (e) {
        result.error = true;
        result.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        result.message = e.message;
    }

    return result;
};

const viewById = async (data, params, info) => {
    const result = {
        error: false,
        data: {}
    };
    const id = Number(params.id) || 0;
    //get data
    try {
        const qData = await product.viewById(id);
        if (qData) {
            (qData.status = dataStatusText[qData.status] || dataStatusText.NA),
                // (qData.created_at = converToLocalTime(qData.created_at)),
                // (qData.updated_at = convertTimestampToDate(qData.updated_at));

                // console.log(qData.created_at);
                // console.log(qData.updated_at);
                result.data = qData;
        } else {
            result.error = true;
            result.status = dataStatusText.NOT_FOUND;
            result.message = `${errorMessages.RESOURCE_NOT_FOUND}`;
        }
    } catch (e) {
        result.error = true;
        result.status = dataStatusText.INTERNAL_SERVER_ERROR;
        result.message = e.message;
    }
    return result;
};

const update = async (data, params) => {
    let result = {
        error: false,
        data: {}
    };

    const id = Number(params.id) || 0;

    try {
        const qData = await product.viewById(id);
        if (qData) {
            if (data.sku !== undefined && data.sku != qData.sku) {
                const existingSku = await product.checkProductBySKU(data.sku);
                if (existingSku) {
                    result.error = true;
                    result.message = PRODUCT.SKU_EXISTS;
                    return result;
                }
            }

            if (data.category_id !== undefined && data.category_id != qData.category_id) {
                const existingCategory = await category.checkCategoryExists(data.category_id);
                if (existingCategory === null) {
                    result.error = true;
                    result.message = CATEGORY.NOT_FOUND_BY_ID;
                    return result;
                }
            }

            let qstatus = "";
            if (data.status === undefined) {
                qstatus = qData.status;
            }
            else {
                qstatus = stateStatus(data.status);
            }

            const saveData = await product.update(id, {
                sku: data.sku || qData.sku,
                category_id: data.category_id || qData.category_id,
                name: data.name || qData.name,
                description: data.description || qData.description,
                status: qstatus,
                updated_at: getCurrentTimestamp()
            });
            result.data = saveData;
        } else {
            result.error = true;
            result.status = dataStatusText.NOT_FOUND;
            result.message = `${errorMessages.RESOURCE_NOT_FOUND}`;
        }
    } catch (error) {
        result.error = true;
        result.status = dataStatusText.INTERNAL_SERVER_ERROR;
        result.message = error.message;
    }
    return result;
};

const deleteById = async (data, params) => {
    const result = {
        error: false,
        data: {}
    };
    const id = Number(params.id) || 0;
    // const { userId } = info;
    //save data
    try {
        const qData = await product.viewById(id);
        if (qData) {
            const saveData = await product.deleteById(id, {
                updated_at: getCurrentTimestamp()
            });
            result.data = saveData;
        } else {
            result.error = true;
            result.status = dataStatusText.NOT_FOUND;
            result.message = `${errorMessages.RESOURCE_NOT_FOUND}`;
        }
    } catch (e) {
        result.error = true;
        result.status = dataStatusText.INTERNAL_SERVER_ERROR;
        result.message = e.message;
    }
    return result;
};

const list = async (data, params, info) => {
    const result = {
        error: false,
        data: {},
        totalRows: '',
        currentPage: '',
        totalPages: ''
    };
    const page = info.queryData && info.queryData.page ? info.queryData.page : '';

    //This will find category id byName
    if(info.queryData.categoryName !== undefined) {
        info.queryData.categoryName = categoryService.simplify(info.queryData.categoryName);

        //This is used in sql row query
        // const categoryData = await category.findCategoryId(info.queryData.categoryName);

        //This is used in sequelize query
        const categoryData = await category.checkByName(info.queryData.categoryName);
        console.log(categoryData);
        info.queryData.categoryId = categoryData.id;
    }
// 
    // console.log(page);
    try {
        const qData = await product.list(page, info);
        result.data = [];
        qData.data.forEach(data => {
            result.data.push({
                id: data.id,
                category_id: data.category_id,
                sku: data.sku,
                name: data.name,
                description: data.description,
                status: dataStatusText[data.status] || dataStatusText.NA,
                created_at: data.created_at,
                updated_at: data.updated_at
            });
        });
        result['totalRows'] = Number(qData.totalRows);
        result['currentPage'] = Number(page) || 1;
        result['totalPages'] = Number(Math.ceil(Number(qData.totalRows) / (info.queryData.limit || pageConfig.PRODUCTS)));
    } catch (e) {
        result.error = true;
        result.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        result.message = e.message;
    }
    return result;
};

const stateStatus = (status) => {
    let stat = "";
    if (status == 'Active') {
        stat = dataStatusText.ACTIVE;
    }
    else if (status == 'Inactive') {
        stat = dataStatusText.INACTIVE;
    }
    else if (status == "Deleted") {
        stat = dataStatusText.DELETED;
    }

    return stat;
}

module.exports = { create, viewById, update, deleteById, list };