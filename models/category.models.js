const { dataStatusText, pageConfig } = require('../config/status');
const { dbConnection } = require('../database/db.config');

const tableName = 'categories';

const create = async data => {
    const query = `INSERT INTO ${tableName} (name, status, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    const params = [data.name, data.status, data.created_at, data.updated_at];

    const qData = await dbConnection.query(query, params);
    return qData.insertId || null;
};


const checkByName = async categoryName => {
    const query = `SELECT id, name AS Category_Name, status FROM ${tableName} WHERE name = ? AND status = ?`;

    const params = [categoryName, dataStatusText.ACTIVE];

    const qData = await dbConnection.query(query, params);
    return qData[0] || null;
};

const findCategoryId = async categoryName => {
    const query = `SELECT id FROM ${tableName} WHERE name = ? AND status = ?`;

    const params = [categoryName, dataStatusText.ACTIVE];

    const qData = await dbConnection.query(query, params);
    return qData[0] || null;
}

const checkCategoryExists = async category_id => {
    const query = `SELECT * FROM ${tableName} WHERE id = ? AND status = ?`;
    const params = [category_id, dataStatusText.ACTIVE];

    const qData = await dbConnection.query(query, params);
    return qData[0] || null;
}

const viewById = async id => {
    const query = `SELECT * FROM ${tableName} WHERE id = ?`;
    const params = [id];
    const qData = await dbConnection.query(query, params);
    return qData[0] || null;
};

const update = async (id, data) => {
    const query = `UPDATE ${tableName} SET name=?, status=?, updated_at=? WHERE id = ?`;

    const params = [data.name, data.status, data.updated_at, id];

    const qData = await dbConnection.query(query, params);
    return qData.affectedRows || null;
};

const deleteById = async (id, data) => {
    const query = `UPDATE ${tableName} SET status = ?, updated_at = ? WHERE id = ?`;
    const params = [dataStatusText.DELETED, data.updated_at, id];

    const qData = await dbConnection.query(query, params);
    return qData.affectedRows || null;
};

const list = async (page, info) => {
    const qData = {
        data: [],
        totalRows: ''
    };
    let limitString = '';

    let limitFromUser = info.queryData.limit;     //limit query value

    let byName = info.queryData.categoryName;

    let countQuery = '';
    let countParams = '';

    if (byName !== undefined) {
        countQuery = `SELECT COUNT(id) as total from ${tableName} where status != ? AND name = ?`;
        countParams = [dataStatusText.DELETED, byName];
    }
    else {
        countQuery = `SELECT COUNT(id) as total from ${tableName} where status != ?`;
        countParams = [dataStatusText.DELETED];
    }

    //Below code used to find total number of available rows.
    const countData = await dbConnection.query(countQuery, countParams);
    qData['totalRows'] = Number(countData[0]['total']);

    //Below if condition execute if user pass page number as a query or pass limit as a query
    if (page || limitFromUser) {
        const offset = (limitFromUser || pageConfig.PRODUCTS) * (page || 1) - (limitFromUser || pageConfig.PRODUCTS);
        limitString = `LIMIT ${offset}, ${limitFromUser || pageConfig.PRODUCTS}`;
    }


    let query = '';
    let params = '';

    if (byName !== undefined) {
        query = `SELECT * FROM ${tableName} WHERE status != ? AND name = ? ${limitString} `;
        params = [dataStatusText.DELETED, byName];
    }
    else {
        query = `SELECT * FROM ${tableName} WHERE status != ? ${limitString} `;
        params = [dataStatusText.DELETED];
    }

    const resultData = await dbConnection.query(query, params);
    qData['data'] = resultData || [];
    return qData;
};



module.exports = { create, checkByName, viewById, update, deleteById, list, checkCategoryExists, findCategoryId };