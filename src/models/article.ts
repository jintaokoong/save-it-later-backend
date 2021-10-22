import S, { Sequelize, DataTypes, Model } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/data/sil-backend/database.sqlite",
});

export class Article extends Model {}

Article.init(
  {
    id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: S.UUIDV4 },
    url: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING },
    textContent: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: sequelize,
    timestamps: true,
  },
);
