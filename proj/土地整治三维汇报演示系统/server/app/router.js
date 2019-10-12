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
  router.get('/attachs/culcWithin/:DB', controller.attachments.culcWithin);
  router.get('/attachs/getTree/:DB', controller.attachments.getTree);
  router.post('/attachs/postAttachment', controller.attachments.postAttachment);
  router.get(
    '/attachs/getAttachmentById/:id/:DB',
    controller.attachments.getAttachmentById
  );
  router.get(
    '/attachs/getAttachmentListById/:id/:DB',
    controller.attachments.getAttachmentListById
  );
  router.delete(
    '/attachs/delAttachmentById/:id/:DB',
    controller.attachments.delAttachmentById
  );
  router.get('/attachs/query', controller.attachments.query);


  router.get(`/geom/getCurrentAreaInfo/:id/:table`, controller.geom.getCurrentAreaInfo);
  router.get(`/geom/setStatus/:id/:status`, controller.geom.setStatus);
};
