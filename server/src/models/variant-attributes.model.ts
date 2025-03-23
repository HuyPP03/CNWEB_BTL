import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
	DataTypes,
} from 'sequelize';
export class VariantAttributes extends Model<
	InferAttributes<VariantAttributes>,
	InferCreationAttributes<VariantAttributes>
> {
	declare variantId: number;
	declare attributeValueId: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
	static initClass = (sequelize: Sequelize) => {
		VariantAttributes.init(
			{
				variantId: { type: DataTypes.INTEGER, primaryKey: true },
				attributeValueId: { type: DataTypes.INTEGER, primaryKey: true },
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'VariantAttributes',
				timestamps: true,
				createdAt: 'createdAt',
				updatedAt: 'updatedAt',
				name: {
					singular: 'variantAttribute',
					plural: 'variantAttributes',
				},
			},
		);
	};
}
