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
      console.log(error);
      rb = helper.getFailed();
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
      console.log(error);
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }

  async postAttachment() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    try {
      //获取FileStream
      const stream = await ctx.getFileStream();
      const bufs = [];
      console.log(stream.fields);
      const { file_name, file_type, attach_to_id, attach_type } = stream.fields;
      ctx.body = stream.fields;

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
      console.log(error);
      await sendToWormhole(stream);
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }

  async getAttachmentById() {
    console.log('in');
    const { ctx, service } = this;
    const helper = ctx.helper;
    const id = this.ctx.params.id;
    console.log(id);
    try {
      const result = await service.attachments.getAttachmentById(id);
      const { file_type, blob_data } = result[0];
      var buffer = Buffer.from(blob_data, 'binary');
      var bufferBase64 = buffer.toString('base64');
      result[0].setDataValue('mime_type', mime.lookup(file_type));
      result[0].blob_data = bufferBase64;
      rb = helper.getSuccess(result);
    } catch (error) {
      console.log(error);
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }

  async getAttachmentListById() {
    const { ctx, service } = this;
    const helper = ctx.helper;
    const id = this.ctx.params.id;
    console.log(id);
    try {
      const result = await service.attachments.getAttachmentListById(id);
      rb = helper.getSuccess(result);
    } catch (error) {
      console.log(error);
      rb = helper.getFailed();
    } finally {
      ctx.body = rb;
    }
  }
}

module.exports = AttachmentsController;
