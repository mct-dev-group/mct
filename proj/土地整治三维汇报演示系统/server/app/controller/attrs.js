'use strict';

const Controller = require('egg').Controller;
let rb = null;

class AttrsController extends Controller {
  async getById() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    const id = this.ctx.params.id;
    try {
      const result = await service.attrs.getById(id);
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }

  async getByParentId() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    const { parentId, pageNum, pageSize } = ctx.request.body;

    const page = helper.getPage(pageNum, pageSize);

    try {
      const result = await service.attrs.getByParentId(parentId, page);
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }

  async getByLikeName() {
    const { ctx, service } = this;
    const helper = ctx.helper;

    const { name, pageNum, pageSize } = ctx.request.body;

    const page = helper.getPage(pageNum, pageSize);

    try {
      const result = await service.attrs.getByLikeName(name, page);
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }

  async getByPosition() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    const { x, y, z } = ctx.request.body;

    try {
      const result = await service.attrs.getByPosition(x, y, z);
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }
}

module.exports = AttrsController;
