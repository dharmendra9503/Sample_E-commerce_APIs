const { Op } = require('sequelize');
const { dataStatusText, pageConfig } = require('../config/status');
const { Categories } = require('../database/db.config');

const create = async data => {

    try {
        const category = await Categories.create(data);
        return category;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }

};

const update = async (id, data) => {

    const params = [id, data];

    //This will return total number of affected rows
    const result = await Categories.update(
        data,
        { where: { id: params[0] } }
    );

    return result || null;
};

const viewById = async id => {
    try {
        const qData = await Categories.findOne({
            where: {
                id: id
            }
        });
        return qData || null;

    } catch (error) {
        console.log("Error in viewById: " + error);
    }
}


const deleteById = async (id, data) => {

    try {
        const params = [id, data.updated_at, dataStatusText.DELETED];

        const result = await Categories.update(
            {
                status: params[2],
                updated_at: params[1]
            },
            { where: { id: params[0] } }
        );

        return result || null;

    } catch (error) {
        console.error('Error Deleting Category:', error);
        throw error;
    }
};

const checkCategoryExists = async category_id => {
    const params = [category_id, dataStatusText.ACTIVE];

    try {
        const qData = await Categories.findOne({
            where: {
                id: params[0],
                status: params[1]
            }
        });
        return qData || null;

    } catch (error) {
        console.log("Error checking category exists or not by Id: " + error);
    }

}

const checkByName = async categoryName => {

    const params = [categoryName, dataStatusText.ACTIVE];

    try {
        const qData = await Categories.findOne({
            where: {
                name: params[0],
                status: params[1]
            }
        });

        return qData || null;

    } catch (error) {
        console.log("Error checking category exists or not by name: " + error);
    }

};


const list = async (page, info) => {
    const qData = {
        data: [],
        totalRows: ''
    };

    let limitFromUser = info.queryData.limit;     //limit query value

    let byName = info.queryData.categoryName;


    try {
        let totalRows = '';
        if (byName !== undefined) {
            totalRows = await Categories.count({
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    },
                    name: byName
                }
            })
        }
        else {
            totalRows = await Categories.count({
                where: {
                    status: {
                        [Op.ne]: dataStatusText.DELETED
                    }
                }
            });
        }

        console.log("Total Rows: " + totalRows);
        qData['totalRows'] = totalRows;
    } catch (error) {
        console.log("Error for finding total Rows (Categories): " + error);
        throw error;
    }

    //Below if condition execute if user pass page number as a query or pass limit as a query
    let limitData;
    let offset;

    if (page || limitFromUser) {
        offset = (limitFromUser || pageConfig.PRODUCTS) * (page || 1) - (limitFromUser || pageConfig.PRODUCTS);
        limitData = Number(limitFromUser || pageConfig.PRODUCTS);
    }


    try {
        let resultData = '';
        if (byName !== undefined) {
            resultData = await Categories.findAll({
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
        else {
            resultData = await Categories.findAll({
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
};

module.exports = { checkCategoryExists, create, update, checkByName, viewById, deleteById, list };