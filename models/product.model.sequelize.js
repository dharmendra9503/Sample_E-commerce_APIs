const { Op } = require('sequelize');
const { dataStatusText, pageConfig } = require('../config/status');
const { Product } = require('../database/db.config');



const create = async data => {

    try {
        const product = await Product.create(data);
        return product;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }

};

const update = async (id, data) => {

    const params = [id, data];

    //This will return total number of affected rows
    const result = await Product.update(
        data,
        { where: { id: params[0] } }
    );

    return result || null;
};

const deleteById = async (id, data) => {

    try {
        const params = [id, data.updated_at, dataStatusText.DELETED];
        console.log(params);

        const result = await Product.update(
            {
                status: params[2],
                updated_at: params[1]
            },
            { where: { id: params[0] } }
        );

        return result || null;

    } catch (error) {
        console.error('Error Deleting product:', error);
        throw error;
    }
};

const viewById = async id => {
    const params = [id];

    const qData = await Product.findOne({
        where: {
            id: params[0]
        }
    });

    return qData || null;
}


const list = async (page, info) => {
    const qData = {
        data: [],
        totalRows: ''
    };

    let limitFromUser = info.queryData.limit;     //limit query value

    let bySku = info.queryData.productSku;          //This is use for product search in list by sku   (productSku query value)
    let byName = info.queryData.productName;        //This is use for product search in list by name  (ProductName query value)
    let byCategoryId = info.queryData.categoryId;   //This is use for product search in list by categoryName  (categoryName query value)


    try {
        let totalRows = '';
        if (bySku !== undefined) {
            totalRows = await Product.count({
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    },
                    sku: bySku
                }
            })
        }
        else if (byName !== undefined) {
            totalRows = await Product.count({
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    },
                    name: byName
                }
            });
        }
        else if (byCategoryId !== undefined) {
            totalRows = await Product.count({
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    },
                    category_id: byCategoryId
                }
            });
        }
        else {
            totalRows = await Product.count({
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    }
                }
            });
        }

        qData['totalRows'] = totalRows;
    } catch (error) {
        console.log("Error for finding total Rows: " + error);
        throw error;
    }

    let limitData;
    let offset;

    if (page || limitFromUser) {
        offset = (limitFromUser || pageConfig.PRODUCTS) * (page || 1) - (limitFromUser || pageConfig.PRODUCTS);
        limitData = Number(limitFromUser || pageConfig.PRODUCTS);
    }

    // console.log(limitData);
    // console.log(offset);


    try {
        let resultData = '';
        if (bySku !== undefined) {
            resultData = await Product.findAll({
                limit: limitData,
                offset: offset,
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    },
                    sku: bySku
                },

            });
        }
        else if (byName !== undefined) {
            resultData = await Product.findAll({
                limit: limitData,
                offset: offset,
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    },
                    name: byName
                }
            });
        }
        else if (byCategoryId !== undefined) {
            resultData = await Product.findAll({
                limit: limitData,
                offset: offset,
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    },
                    category_id: byCategoryId
                }
            });
        }
        else {
            resultData = await Product.findAll({
                limit: limitData,
                offset: offset,
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    }
                }
            });
        }

        qData['data'] = resultData || [];

    } catch (error) {
        console.log("Error retriving data: " + error);
    }

    return qData;
}

const checkProductBySKU = async sku => {
    const params = [sku, dataStatusText.ACTIVE];

    const qData = await Product.findOne({
        where: {
            sku: params[0],
            status: params[1]
        }
    });

    return qData || null;
};

module.exports = { viewById, checkProductBySKU, update, create, deleteById, list };