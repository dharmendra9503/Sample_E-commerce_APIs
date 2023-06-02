const { dataStatusText, pageConfig } = require('../config/status');
const { dbConnection } = require('../database/db.config');

const tableName = 'product';

const create = async data => {
    const query = `INSERT INTO ${tableName} (sku, category_id, name, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [data.sku, data.category_id, data.name, data.description, data.status, data.created_at, data.updated_at];

    const qData = await dbConnection.query(query, params);
    return qData.insertId || null;
};

const checkProductBySKU = async sku => {
    const query = `SELECT id, sku AS Product_No, name AS Product_Name, status FROM ${tableName} WHERE sku = ? AND status = ?`;

    const params = [sku, dataStatusText.ACTIVE];

    const qData = await dbConnection.query(query, params);
    return qData[0] || null;
};

const viewById = async id => {
    const query = `SELECT * FROM ${tableName} WHERE id = ?`;
    const params = [id];
    const qData = await dbConnection.query(query, params);
    // console.log(qData[0]);
    return qData[0] || null;
};

const update = async (id, data) => {
    const query = `UPDATE ${tableName} SET sku=?, category_id=?, name=?, description=?, status=?, updated_at=? WHERE id = ?`;

    const params = [data.sku, data.category_id, data.name, data.description, data.status, data.updated_at, id];

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

    let bySku = info.queryData.productSku;        //This is use for product search in list by sku   (productSku query value)
    let byName = info.queryData.productName;      //This is use for product search in list by name  (ProductName query value)
    let byCategoryId = info.queryData.categoryId;

    let countQuery = '';
    let countParams = '';

    //If user want to search product by sku and name then below if condition will execute
    if (bySku !== undefined && byName !== undefined) {
        countQuery = `SELECT COUNT(id) as total from ${tableName} where status != ? AND sku = ? AND name = ?`;
        countParams = [dataStatusText.DELETED, bySku, byName];
    }
    // If user want to search product by sku then below if condition will execute
    else if (bySku !== undefined) {
        countQuery = `SELECT COUNT(id) as total from ${tableName} where status != ? AND sku = ?`;
        countParams = [dataStatusText.DELETED, bySku];
    }
    // If user want to search product by name then below if condition will execute
    else if (byName !== undefined) {
        countQuery = `SELECT COUNT(id) as total from ${tableName} where status != ? AND name = ?`;
        countParams = [dataStatusText.DELETED, byName];
    }
    else if (byCategoryId !== undefined) {
        countQuery = `SELECT COUNT(id) as total from ${tableName} where status != ? AND category_id = ?`;
        countParams = [dataStatusText.DELETED, byCategoryId];
    }
    //If user want to see whole product list then below condition will execute
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

    if (bySku != undefined && byName != undefined) {
        query = `SELECT * FROM ${tableName} WHERE status != ? AND sku = ? AND name = ? ${limitString} `;
        params = [dataStatusText.DELETED, bySku, byName];
    }
    else if (bySku !== undefined) {
        query = `SELECT * FROM ${tableName} WHERE status != ? AND sku = ? ${limitString} `;
        params = [dataStatusText.DELETED, bySku];
    }
    else if (byName != undefined) {
        query = `SELECT * FROM ${tableName} WHERE status != ? AND name = ? ${limitString} `;
        params = [dataStatusText.DELETED, byName];
    }
    else if (byCategoryId !== undefined) {
        query = `SELECT * FROM ${tableName} WHERE status != ? AND category_id = ? ${limitString} `;
        params = [dataStatusText.DELETED, byCategoryId];
    }
    else {
        query = `SELECT * FROM ${tableName} WHERE status != ? ${limitString} `;
        params = [dataStatusText.DELETED];
    }
    const resultData = await dbConnection.query(query, params);
    qData['data'] = resultData || [];
    return qData;
};

module.exports = { create, checkProductBySKU, viewById, update, deleteById, list };