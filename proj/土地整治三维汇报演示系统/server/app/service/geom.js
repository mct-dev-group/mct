'use strict';

const Service = require('egg').Service;

class GeomService extends Service {
  /**
   * 获取当前区域详细信息
   * @param {Number} gid - 对应表字段gid
   * @param {String} table - 对应表名
   */
  async getCurrentAreaInfo (gid , table, DB) {
    const sequelize = this.app.Sequelize;
    const sql = `select * from ${table} where gid = ${gid};`;
    return await this.ctx[DB].query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
  }

  /**
   * 修改规划图斑状态
   * @param {Number} gid
   * @param {String} status - 状态 1，2，3，4
   */
  async setStatus (gid, status, DB) {
    const sequelize = this.app.Sequelize;
    const sql = `update plan set status = ${status} where gid = ${gid}`;
    return await this.ctx[DB].query(sql, {
      type: sequelize.QueryTypes.SELECT
    });
  }

  async getLayer (x, y, DB){
    const sequelize = this.app.Sequelize;
    const plan = `SELECT * FROM plan WHERE st_contains (geom,ST_GeomFromText ( 'POINT(${x} ${y})', 4547 ));`;
    const spot = `SELECT * FROM spot WHERE st_contains (geom,ST_GeomFromText ( 'POINT(${x} ${y})', 4547 ));`;
    const village = `SELECT * FROM village WHERE st_contains (geom,ST_GeomFromText ( 'POINT(${x} ${y})', 4547 ));`;
    const country = `SELECT * FROM country WHERE st_contains (geom,ST_GeomFromText ( 'POINT(${x} ${y})', 4547 ));`;
    const p =  await this.ctx[DB].query(plan, {
      type: sequelize.QueryTypes.SELECT
    });
    if (p.length){
      return `plan.${p[0].gid}`;
    }
    const s =  await this.ctx[DB].query(spot, {
      type: sequelize.QueryTypes.SELECT
    });
    if (s.length){
      return `spot.${s[0].gid}`;
    }
    const v = await this.ctx[DB].query(village, {
      type: sequelize.QueryTypes.SELECT
    });
    if (v.length){
      return `village.${v[0].gid}`;
    }
    const c = await this.ctx[DB].query(country, {
      type: sequelize.QueryTypes.SELECT
    });
    if (c.length){
      return `country.${c[0].gid}`;
    }
  }
 }

module.exports = GeomService;
