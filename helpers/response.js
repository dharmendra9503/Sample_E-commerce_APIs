const config = require('../config/status');

const success = (res, message, data = null) => {
    const response = {
        status: true,
        message,
    };

    if (data) response.data = data;
    res.status(config.HTTP_STATUS_CODES.OK).send(response);
};

const serverError = (res, error) => {
    res.status(config.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        status: false,
        message: error.toString(),
        data: {}
    });
};

const validationError = (res, errors) => {
    const response = {
        status: false,
        message: errors,
        data: {}
    };

    res.status(config.HTTP_STATUS_CODES.BAD_REQUEST).json(response);
};

const badRequestError = (res, message) => {
    res.status(config.HTTP_STATUS_CODES.BAD_REQUEST).send({
        status: false,
        message,
        data: {}
    });
};

const authorizationError = (res, message) => {
    res.status(config.HTTP_STATUS_CODES.UNAUTHORIZED).send({
        status: false,
        message,
        data: {}
    });
};

const accessError = (res, message) => {
    res.status(config.HTTP_STATUS_CODES.FORBIDDEN).send({
        status: false,
        message,
        data: {}
    });
};

const noDataFoundError = (res, message) => {
    res.status(config.HTTP_STATUS_CODES.NOT_FOUND).send({
        status: false,
        message,
        data: {}
    });
};

module.exports = {
    success,
    badRequestError,
    authorizationError,
    validationError,
    serverError,
    accessError,
    noDataFoundError
};