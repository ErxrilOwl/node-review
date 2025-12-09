const { Sequalize, DataTypes } = require('sequelize');

const sequalize = require('../util/database');

const OrderItem = sequalize.define('orderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
});

module.exports = OrderItem;