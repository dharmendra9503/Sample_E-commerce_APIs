const { HTTP_STATUS_CODES, dataStatusText, pageConfig, user_type } = require('../config/status');
const category = require('../models/category.models');
const { getCurrentTimestamp } = require('../utils/date.util');
const { CATEGORY, errorMessages } = require('../helpers/responseMessage');

const create = async (data, params) => {
    let result = {
        error: false,
        data: {}
    };

    try {
        const categoryName = simplify(data.name);
        const existingCategory = await category.checkByName(categoryName);

        if (existingCategory) {
            result.error = true;
            result.message = CATEGORY.CATEGORY_EXISTS;
            return result;
        }

        // Save data
        const qData = await category.create({
            name: categoryName,
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
        const qData = await category.viewById(id);
        if (qData) {
            (qData.status = dataStatusText[qData.status] || dataStatusText.NA),
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
    // const { userId } = info;

    try {
        const qData = await category.viewById(id);
        if (qData) {
            if (data.sku != qData.sku) {
                const existingCategory = await category.checkByName(data.sku);
                if (existingCategory) {
                    result.error = true;
                    result.message = CATEGORY.CATEGORY_EXISTS;
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

            const saveData = await category.update(id, {
                name: data.name || qData.name,
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

    //save data
    try {
        const qData = await category.viewById(id);
        if (qData) {
            const saveData = await category.deleteById(id, {
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

    if (info.queryData.categoryName !== undefined) {
        info.queryData.categoryName = simplify(info.queryData.categoryName);
    }

    // console.log(page);
    try {
        const qData = await category.list(page, info);
        result.data = [];
        qData.data.forEach(data => {
            result.data.push({
                id: data.id,
                name: data.name,
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

const simplify = (categoryName) => {
    let cName = categoryName.trim();
    cName = cName.toLowerCase();
    cName = cName.replace(/ /g, '_');
    return cName;
}

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

module.exports = { create, viewById, update, deleteById, list, simplify};