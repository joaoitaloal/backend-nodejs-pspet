import { Sequelize, DataTypes } from "sequelize"

const sequelize = new Sequelize({ // Exemplo de login no banco de dados com Sequelize
    dialect: 'postgres',
    database: 'teste',
    username: 'teste',
    password: 'teste',
    host: 'localhost',
    port: 5432,
    ssl: true,
    logging: false
  });

export const messages = sequelize.define('messages', {
    name: DataTypes.STRING,
    message: DataTypes.STRING(1024),
    date: DataTypes.STRING,
    time: DataTypes.STRING
})

export async function syncDB(){
    await sequelize.sync({alter: true})
}