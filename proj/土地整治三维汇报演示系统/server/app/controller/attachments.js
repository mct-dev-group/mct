'use strict';

const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');
const mime = require('mime');
let rb = null;

class AttachmentsController extends Controller {
  async culcWithin() {
    const { ctx, service } = this;
    const helper = ctx.helper;

    try {
      const result = await service.attachments.getWithin();
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed(error);
    } finally {
      ctx.body = rb;
    }
  }

  async getTree() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    try {
      const result = await service.attachments.getTree();
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed(error);
    } finally {
      ctx.body = rb;
    }
  }

  async postAttachment() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    let stream = null;
    try {
      //获取FileStream
      stream = await ctx.getFileStream();
      const bufs = [];
      const { file_name, file_type, attach_to_id, attach_type } = stream.fields;
      // ctx.body = stream.fields;

      stream.on('data', d => {
        bufs.push(d);
      });
      // await stream
      const end = new Promise((resolve, reject) => {
        stream.on('end', () =>
          resolve(async () => {
            let buf = Buffer.concat(bufs);
            const result = await service.attachments.postAttachment(
              file_name,
              file_type,
              buf,
              attach_to_id,
              attach_type
            );
            return result;
          })
        );
        stream.on('error', reject);
      });
      let saveAndGetList = await end;
      let result = await saveAndGetList();
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed(error);
      console.log(error);
      await sendToWormhole(stream);
    } finally {
      ctx.body = rb;
    }
  }

  async getAttachmentById() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    const id = this.ctx.params.id;
    try {
      const result = await service.attachments.getAttachmentById(id);
      const { file_type, blob_data } = result[0];
      var buffer = Buffer.from(blob_data, 'binary');
      var bufferBase64 = buffer.toString('base64');
      result[0].setDataValue('mime_type', mime.lookup(file_type));
      result[0].blob_data = bufferBase64;
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed(error);
    } finally {
      ctx.body = rb;
    }
  }

  async delAttachmentById() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    const id = this.ctx.params.id;
    try {
      const result = await service.attachments.delAttachmentById(id);
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed(error);
    } finally {
      ctx.body = rb;
    }
  }

  async getAttachmentListById() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    const id = this.ctx.params.id;
    try {
      const result = await service.attachments.getAttachmentListById(id);
      rb = helper.getSuccess(result);
    } catch (error) {
      rb = helper.getFailed(error);
    } finally {
      ctx.body = rb;
    }
  }
}

module.exports = AttachmentsController;
