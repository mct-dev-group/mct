'use strict';

module.exports = app => {
  const { INTEGER, STRING, BLOB } = app.Sequelize;

  const Attachment = app.model.define('attachment', {
    gid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attach_to_id: {
      type: INTEGER,
    },
    file_name: {
      type: STRING,
    },
    file_type: {
      type: STRING,
    },
    attach_type: {
      type: STRING,
      enum: ['zzq_img', 'zzh_img'],
    },
    blob_data: {
      type: BLOB,
    },
  });

  return Attachment;
};
