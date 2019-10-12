/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1564362436612_8701';

  // add your middleware config here
  config.middleware = [];

  config.static = {
    prefix: '',
    dir: path.join(appInfo.baseDir, 'app/public'),
    dynamic: true,
    preload: false,
    // maxAge:31536000,
    maxAge: 0,
    buffer: false,
  };
  config.multipart = {
    mode: 'stream',
    fileSize:'1000mb',
    fileExtensions: [ '.txt','.doc','.pdf','.docx','.xls','.xlsx','.ppt','.msi','.rar','.exe' ]
  };
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['*'],
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.sequelize ={
    datasources:[
      {
        delegate:'qibin_db',
        baseDir: 'model',
        dialect: 'postgres',
        host: '192.168.0.250',
        port: 8083,
        database: 'qibin_db',
        username: 'postgres',
        password: 'admin',
        logging(...args){

        },
        define: {
          timestamps: false,
        },
        pool: {
          max: 50,
          min: 0,
          idle: 30000,
        },
      },
      {
        delegate:'qibin',
        baseDir: 'qibin_model',
        dialect: 'postgres',
        host: '192.168.0.250',
        port: 8083,
        database: 'qibin',
        username: 'postgres',
        password: 'admin',
        logging(...args){

        },
        define: {
          timestamps: false,
        },
        pool: {
          max: 50,
          min: 0,
          idle: 30000,
        },
      }
    ]
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
