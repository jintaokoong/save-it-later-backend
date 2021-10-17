import S, { Sequelize, DataTypes, Model } from 'sequelize'
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'readability.sqlite',
});

export class Article extends Model {
}

Article.init({
  id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: S.UUIDV4, },
  title: { type: DataTypes.STRING},
  content: { type: DataTypes.STRING },
  textContent: { type: DataTypes.STRING },
}, {
  sequelize: sequelize,
  timestamps: true,
})
