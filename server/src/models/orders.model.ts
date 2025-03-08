import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
	DataTypes,
} from 'sequelize';
export class Orders extends Model<
	InferAttributes<Orders>,
	InferCreationAttributes<Orders>
> {
	declare id: CreationOptional<number>;
	declare customerId: number;
	declare warehouseId: CreationOptional<number>;
	declare totalAmount: number;
	declare status: CreationOptional<
		'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
	>;
	declare shippingAddress: string;
	declare paymentMethod: CreationOptional<string>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	static initClass = (sequelize: Sequelize) => {
		Orders.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				customerId: { type: DataTypes.INTEGER, allowNull: false },
				warehouseId: DataTypes.INTEGER,
				totalAmount: {
					type: DataTypes.DECIMAL(15, 2),
					allowNull: false,
				},
				status: {
					type: DataTypes.ENUM(
						'pending',
						'processing',
						'shipped',
						'delivered',
						'cancelled',
					),
					defaultValue: 'pending',
				},
				shippingAddress: { type: DataTypes.TEXT, allowNull: false },
				paymentMethod: DataTypes.STRING(50),
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'Orders',
				timestamps: true,
				createdAt: 'createdAt',
				updatedAt: 'updatedAt',
				name: { singular: 'order', plural: 'orders' },
			},
		);
	};
}
