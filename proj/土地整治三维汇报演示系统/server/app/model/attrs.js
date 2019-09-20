'use strict';

module.exports = app => {
  const { INTEGER, FLOAT, STRING, JSONB } = app.Sequelize;

  const Attrs = app.model.define(
    'attrs',
    {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      minZ: {
        field: 'min_z',
        type: FLOAT(53),
      },
      maxZ: {
        field: 'max_z',
        type: FLOAT(53),
      },
      meta: {
        type: STRING,
      },
      parentId: {
        field: 'parent_id',
        type: INTEGER,
      },
      contour: {
        type: STRING,
      },
      level: {
        field: 'layer',
        type: INTEGER,
      },
      personaldata: {
        type: JSONB,
      },
      name: {
        type: STRING,
      },
    },
    {
      tableName: 'attrs',
    }
  );

  return Attrs;
};
