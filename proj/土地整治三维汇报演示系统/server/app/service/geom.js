'use strict';

const Service = require('egg').Service;

class GeomService extends Service {
  /**
   * 获取当前区域详细信息
   * @param {Number} gid - 对应表字段gid
   * @param {String} table - 对应表名
   */
  async getCurrentAreaInfo (gid , table) {
    const sequelize = this.app.Sequelize;
    const sql = `select * from ${table} where gid = ${gid};`;
    return await this.ctx.model.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
  }

  /**
   * 修改规划图斑状态
   * @param {Number} gid 
   * @param {String} status - 状态 1，2，3，4
   */
  async setStatus (gid, status) {
    const sequelize = this.app.Sequelize;
    const sql = `update plan set status = ${status} where gid = ${gid}`;
    return await this.ctx.model.query(sql, {
      type: sequelize.QueryTypes.SELECT
    });
  }
 }

module.exports = GeomService;
