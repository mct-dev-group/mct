'use strict';

const Controller = require('egg').Controller;

let rb = null;
class GeomController extends Controller {
  async getCurrentAreaInfo () {
    const { id, table } = this.ctx.params;
    try {
      const result = await this.service.geom.getCurrentAreaInfo(id, table);
      rb = this.ctx.helper.getSuccess(result);
    } catch (error) {
      rb = this.ctx.helper.getFailed();
    } finally {
      this.ctx.body = rb;
    }
  }

  async setStatus () {
    const { id, status } = this.ctx.params;
    try {
      const result = await this.service.geom.setStatus(id, status);
      rb = this.ctx.helper.getSuccess(result);
    } catch (error) {
      rb = this.ctx.helper.getFailed();
    } finally {
      this.ctx.body = rb;
    }
  }
}

module.exports = GeomController;
