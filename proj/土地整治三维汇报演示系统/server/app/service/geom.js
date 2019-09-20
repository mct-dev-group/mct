'use strict';

const Service = require('egg').Service;

class GeomService extends Service {
  async getCurrentAreaInfo (id , table) {
    const sequelize = this.app.Sequelize;
    const sql = `select * from ${table} where gid = ${id};`;
    return await this.ctx.model.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
  }
}

module.exports = GeomService;
