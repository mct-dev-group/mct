module.exports = {
  getPage(pageNum, pageSize) {
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);

    return {
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
    };
  },
  getSuccess(data = null, msg = '操作成功！') {
    return {
      code: 1,
      data,
      msg,
    };
  },
  getFailed(data = null, msg = '操作失败！') {
    return {
      code: 0,
      data,
      msg,
    };
  },
};
