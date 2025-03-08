import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
	DataTypes,
} from 'sequelize';
export class Promotions extends Model<
	InferAttributes<Promotions>,
	InferCreationAttributes<Promotions>
> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare discountPercent: CreationOptional<number>;
	declare startDate: Date;
	declare endDate: Date;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	static initClass = (sequelize: Sequelize) => {
		Promotions.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				name: { type: DataTypes.STRING(100), allowNull: false },
				discountPercent: DataTypes.DECIMAL(5, 2),
				startDate: { type: DataTypes.DATE, allowNull: false },
				endDate: { type: DataTypes.DATE, allowNull: false },
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'Promotions',
				timestamps: true,
				createdAt: 'createdAt',
				updatedAt: 'updatedAt',
				name: { singular: 'promotion', plural: 'promotions' },
			},
		);
	};
}
