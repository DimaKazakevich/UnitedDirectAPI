const Sequelize = require('sequelize')
const Model = Sequelize.Model
const {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME} = require('../config/envConfig')

class Category extends Model {
}

class Product extends Model {
}

class OrderDetails extends Model {
}

class Order extends Model {
}

class User extends Model {
}

class Role extends Model {
}

class UserRoles extends Model {
}

class Image extends Model {
}


const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST, dialect: 'mysql'
})

const models = []

models.categories = Category.init(
    {
        id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING, allowNull: false}
    },
    {
        sequelize, tableName: 'category', timestamps: false
    }
);

models.products = Product.init(
    {
        id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        title: {type: Sequelize.STRING, allowNull: false},
        description: {type: Sequelize.STRING(1000), allowNull: false},
        price: {type: Sequelize.DECIMAL, allowNull: false},
        categoryId: {type: Sequelize.INTEGER, allowNull: false, references: {model: Category, key: 'id'}}
    },
    {sequelize, tableName: 'product', timestamps: false}
);

models.users = User.init(
    {
        id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        email: {type: Sequelize.STRING, allowNull: false},
        password: {type: Sequelize.STRING, allowNull: false}
    },
    {sequelize, tableName: 'user', timestamps: false}
);

models.orders = Order.init(
    {
        id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        totalCost: {type: Sequelize.DECIMAL, allowNull: true, defaultValue: 0},
        datetime: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
        status: {type: Sequelize.STRING, allowNull: false, defaultValue: 'In processing'},
        userId: {type: Sequelize.INTEGER, allowNull: false, references: {model: User, key: 'id'}}
    },
    {sequelize, tableName: 'order', timestamps: false}
);

models.orderDetails = OrderDetails.init(
    {
        productId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {model: Product, key: 'id'}
        },
        orderId: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, references: {model: Order, key: 'id'}},
        quantity: {type: Sequelize.INTEGER, allowNull: false}
    },
    {
        hooks: {
            async afterCreate(attributes, options) {
                let product = await Product.findByPk(attributes.productId, {raw: true})
                let order = await Order.findByPk(attributes.orderId, {raw: true})
                let totalProductPrice = product.price * attributes.quantity
                let currentOrderTotalCost = order.totalCost
                await Order.update({totalCost: currentOrderTotalCost + totalProductPrice},
                    {
                        where: {id: attributes.orderId}
                    }
                )
            }
        },
        sequelize, tableName: 'order_details', timestamps: false
    }
);

models.roles = Role.init(
    {
        id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING, allowNull: false}
    },
    {sequelize, tableName: 'role', timestamps: false}
);

models.userRoles = UserRoles.init(
    {
        userId: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, references: {model: User, key: 'id'}},
        roleId: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, references: {model: Role, key: 'id'}}
    },
    {sequelize, tableName: 'user_roles', timestamps: false}
);

models.images = Image.init(
    {
        fileId: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        productId: {
            type: Sequelize.INTEGER, allowNull: false, primaryKey: true, references: {model: Product, key: 'id'}
        },
        isMain: {type: Sequelize.BOOLEAN, allowNull: false}
    },
    {sequelize, tableName: 'images', timestamps: false}
)

Category.hasMany(Product, {as: 'products', foreignKey: 'categoryId'})
Product.hasMany(OrderDetails, {as: 'order_details', foreignKey: 'productId'})
Order.hasMany(OrderDetails, {as: 'order_details', foreignKey: 'orderId'})
OrderDetails.belongsTo(Order, {as: 'order', foreignKey: 'orderId'})
OrderDetails.belongsTo(Product, {as: 'product', foreignKey: 'productId'})
Product.belongsTo(Category, {as: 'category', foreignKey: 'categoryId'})

/*sequelize.sync({force: true});*/

exports.models = models
exports.sequelize = sequelize
