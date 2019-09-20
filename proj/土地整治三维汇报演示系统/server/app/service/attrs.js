'use strict';

const Service = require('egg').Service;

class AttrsService extends Service {
  // 根据id查询
  async getById(id) {
    const sequelize = this.app.Sequelize;
    return await this.ctx.model.Attrs.findAll({
      where: {
        id,
      },
      attributes: [
        'id',
        'name',
        'minZ',
        'maxZ',
        'meta',
        'level',
        [sequelize.fn('ST_ASTEXT', sequelize.col('contour')), 'contour'],
        'parentId',
        'personaldata',
      ],
    });
  }

  // 根据parentId查询
  async getByParentId(parentId, page) {
    const sequelize = this.app.Sequelize;
    return await this.ctx.model.Attrs.findAndCountAll({
      where: {
        parentId: parentId,
      },
      attributes: [
        'id',
        'name',
        'minZ',
        'maxZ',
        'meta',
        'level',
        [sequelize.fn('ST_ASTEXT', sequelize.col('contour')), 'contour'],
        'parentId',
        'personaldata',
      ],
      offset: page.offset,
      limit: page.limit,
      order: ['id'],
    });
  }

  // 根据name模糊匹配分页查询
  async getByLikeName(name, page) {
    const sequelize = this.app.Sequelize;
    const Op = sequelize.Op;
    return await this.ctx.model.Attrs.findAndCountAll({
      where: {
        name: {
          [Op.like]: '%' + name + '%',
        },
      },
      attributes: [
        'id',
        'name',
        'minZ',
        'maxZ',
        'meta',
        'level',
        [sequelize.fn('ST_ASTEXT', sequelize.col('contour')), 'contour'],
        'parentId',
        'personaldata',
      ],
      offset: page.offset,
      limit: page.limit,
      order: ['id'],
    });
  }

  // 根据坐标点查询
  async getByPosition(x, y, z) {
    const sequelize = this.app.Sequelize;
    const Op = sequelize.Op;
    return await this.ctx.model.Attrs.findAll({
      where: {
        '': sequelize.fn(
          'ST_Contains',
          sequelize.col('contour'),
          sequelize.fn('GeomFromEWKT', `SRID=4326;point(${x} ${y} ${z})`)
        ),
        min_z: {
          [Op.lte]: z,
        },
        max_z: {
          [Op.gte]: z,
        },
      },
      attributes: [
        'id',
        'name',
        'minZ',
        'maxZ',
        'meta',
        'level',
        [sequelize.fn('ST_ASTEXT', sequelize.col('contour')), 'contour'],
        'parentId',
        'personaldata',
      ],
    });
  }
}

module.exports = AttrsService;
