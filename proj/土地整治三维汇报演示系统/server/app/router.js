'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/attrs/getById/:id', controller.attrs.getById);
  router.post('/attrs/getByParentId', controller.attrs.getByParentId);
  router.post('/attrs/getByLikeName', controller.attrs.getByLikeName);
  router.post('/attrs/getByPosition', controller.attrs.getByPosition);
  router.post('/attachs/culcWithin', controller.attachments.culcWithin);
  router.get('/attachs/getTree', controller.attachments.getTree);
  router.post('/attachs/postAttachment', controller.attachments.postAttachment);
  router.get(
    '/attachs/getAttachmentById/:id',
    controller.attachments.getAttachmentById
  );
  router.get(
    '/attachs/getAttachmentListById/:id',
    controller.attachments.getAttachmentListById
  );
  router.delete(
    '/attachs/delAttachmentById/:id',
    controller.attachments.delAttachmentById
  );

  // 地区详细查询
  router.get('/geom/getCurrentAreaInfo/:id/:table', controller.geom.getCurrentAreaInfo);
};
