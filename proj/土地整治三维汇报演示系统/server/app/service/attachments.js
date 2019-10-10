'use strict';

const Service = require('egg').Service;

class AttachmentsService extends Service {
  // 计算空间是否包含--测试
  async culcWithin(DB) {
    const sequelize = this.app.Sequelize;
    const truncate = `truncate table country_village_tree;`;
    const insert_country = `insert into country_village_tree (from_table, id, parent) (select 'country', id, 0 from country);`;
    const insert_village = `insert into country_village_tree (from_table, id, parent) (select 'village', ov.id, (select cv.gid from country c,village v, country_village_tree cv where ST_Contains(c.geom,v.geom) and v.id = ov.id and cv.from_table = 'country' and cv.id = c.id) from village ov);`;
    const insert_plan = `insert into country_village_tree (from_table, id, parent) (select 'plan', op.id, (select cv.gid from village v, plan p, country_village_tree cv where ST_Contains(v.geom, p.geom) and p.id = op.id and cv.from_table = 'village' and cv.id = v.id) from plan op);`;
    const insert_spot = `insert into country_village_tree (from_table, id, parent) (select 'spot', os.id, (select cv.gid from village v, spot s, country_village_tree cv where ST_Contains(v.geom, s.geom) and s.id = os.id and cv.from_table = 'village' and cv.id = v.id) from spot os);`;

    await this.app.model.query(truncate, {
      type: sequelize.QueryTypes.TRUNCATE,
    });
    await this.app.model.query(insert_country, {
      type: sequelize.QueryTypes.INSERT,
    });
    await this.app.model.query(insert_village, {
      type: sequelize.QueryTypes.INSERT,
    });
    await this.app.model.query(insert_plan, {
      type: sequelize.QueryTypes.INSERT,
    });
    await this.app.model.query(insert_spot, {
      type: sequelize.QueryTypes.INSERT,
    });
    return await this.app.model.query(`select * from country_village_tree`, {
      type: sequelize.QueryTypes.SELECT,
    });
  }

  async getTree(DB) {
    const sequelize = this.app.Sequelize;
    const query = `
      select cvt.parent, cvt.gid, cvt.id, cvt.from_table,
      case
      when cvt.from_table = 'country' then
        (select c.name as label from country c where c.gid = cvt.id and cvt.from_table = 'country')
      when cvt.from_table = 'village' then
        (select v.name as label from village v where v.gid = cvt.id and cvt.from_table = 'village')
      when cvt.from_table = 'spot' then
        (select s.objectid as label from spot s where s.gid = cvt.id and cvt.from_table = 'spot')
      when cvt.from_table = 'plan' then
        (select p.objectid as label from plan p where p.gid = cvt.id and cvt.from_table = 'plan')
      else
        '县'
      end as label
      from country_village_tree cvt where not cvt.from_table = 'attachments'`;
    return await this.app[DB].query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
  }

  // 保存附件
  async postAttachment(file_name, file_type, bufs, attach_to_id, attach_type, DB) {
    const sequelize = this.app.Sequelize;
    let list = [];
    if (attach_type) {
      // list = await this.ctx.model.Attachments.findAll({
      //   where: {
      //     attach_to_id,
      //     attach_type,
      //   },
      //   attributes: ['gid'],
      // });
      list = await this.app[DB].query(
        `select gid from attachments where attach_to_id = '${attach_to_id}' and attach_type = '${attach_type}';`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
    }
    if (list.length) {
      await this.app[DB].query(
        `update attachments set file_name=${file_name}, file_type=${file_type}, attach_to_id=${attach_to_id}, blob_data= ?, attach_type=${attach_type}, where attach_to_id = '${attach_to_id}'' and attach_type = '${attach_type}'';`,
        {
          replacements: [bufs],
          type: sequelize.QueryTypes.UPDATE,
        }
      );
      // await this.ctx.qibin.Attachments.update(
      //   {
      //     file_name,
      //     file_type,
      //     attach_to_id,
      //     blob_data: bufs,
      //     attach_type,
      //   },
      //   {
      //     where: {
      //       attach_to_id,
      //       attach_type,
      //     },
      //   }
      // );
    } else {
      await this.app[DB].query(
        `insert into attachments ( file_name, file_type, attach_to_id, blob_data, attach_type) values ('${file_name}', '${file_type}', '${attach_to_id}', ${bufs}, '${attach_type}');`,
        {
          type: sequelize.QueryTypes.INSERT,
        }
      );
      // await this.ctx.qibin.Attachments.create({
      //   file_name,
      //   file_type,
      //   attach_to_id,
      //   blob_data: bufs,
      //   attach_type,
      // });
      await this.app[DB].query(
        `insert into country_village_tree ( from_table, id, parent)
              (select  'attachments',
              oa.gid,
              oa.attach_to_id
              from attachments oa
              where not exists (select 1 from country_village_tree ct
              where ct.parent = oa.attach_to_id and ct.id = oa.gid));`,
        {
          type: sequelize.QueryTypes.INSERT,
        }
      );
    }
    return await this.getAttachmentListById(attach_to_id);
  }
  async getAttachmentById(id, DB) {
    const sequelize = this.app.Sequelize;
    return await this.app[DB].query(
      `select  gid, attach_to_id, file_name, file_type, blob_data, attach_type from attachments where gid = ${id};`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      )
  }
  async delAttachmentById(id, DB) {
    const sequelize = this.app.Sequelize;
    await this.app[DB].query(
      `delete from country_village_tree where id=${id} and from_table='attachments';`,
      {
        type: sequelize.QueryTypes.DELETE,
      }
    );
    return await this.app[DB].query(
      `delete from attachments where gid=${id};`,
      {
        type: sequelize.QueryTypes.DELETE,
      }
    );
  }
  async getAttachmentListById(id, DB) {
    const sequelize = this.app.Sequelize;
    return await this.app[DB].query(
      `select gid, attach_to_id, file_name, file_type, attach_type from attachments where attach_to_id = ${id};`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
  }
  async query(queryStr, DB) {
    const sequelize = this.app.Sequelize;
    console.log(queryStr);
    return await this.app[DB].query(
      queryStr
      //   {
      //   type: sequelize.QueryTypes[queryType],
      // }
    );
  }
}

module.exports = AttachmentsService;
