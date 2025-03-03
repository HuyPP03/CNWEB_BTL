import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
	DataTypes,
	Optional,
} from 'sequelize';

export class Users extends Model<
	InferAttributes<Users>,
	InferCreationAttributes<Users>
> {
	declare id: CreationOptional<number>;
	declare name: CreationOptional<string>;
	declare email: string;
	declare password: CreationOptional<string>;
	declare isVerified: CreationOptional<boolean>;
	declare isForgotPassword: CreationOptional<boolean>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static initClass = (sequelize: Sequelize) => {
		Users.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				name: DataTypes.STRING(70),
				email: {
					type: DataTypes.STRING(100),
					unique: true,
				},
				password: DataTypes.STRING(100),
				isVerified: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
				isForgotPassword: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'users',
				timestamps: true,
				createdAt: 'createdAt',
				updatedAt: 'updatedAt',
				name: {
					singular: 'user',
					plural: 'users',
				},
			},
		);
	};
}
