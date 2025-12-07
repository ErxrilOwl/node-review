const { Sequalize, DataTypes } = require('sequelize');

const sequalize = require('../util/database');

const CartItem = sequalize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
});

module.exports = CartItem;