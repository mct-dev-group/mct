/**
 * 随机id
 * @method guid()
 * @returns {String} 返回随机id
 */
export function guid() {
  function s () {
    return Math.floor((1 + Math.random()) * 0x1000).toString(16).substring(1);
  }
  return s() + s() + '_' + s();
}

/**
 * ES6 模板
 * @method template
 * @param {Object} option - 参数对象
 * @param {String} option.template - 字符串模板
 * @param {Object} option.data - 数据
 * @returns {String} 返回编译后的字符串
 * @example 
 * var arr = [{name: '王富贵',addr: 'wh',phone: 110}, {name: '王富贵',addr: 'wh1',phone: 111}];
 * var str = `<ul>
 *    <% for(let i = 0; i < data.length; i++) { %>
 *      <li>姓名：<%= data[i].name %>， 地址：<%= data[i].addr %>， 电话：<%= data[i].phone %></li>
 *    <% } %>
 *  </ul>`;
 * var r = getTemplateStr({
 *   template: str,
 *   data: arr
 * });
 */
export function getTemplateStr(option) {
  let {template, data} = option;
  function compile () {
    const evalExpr = /<%=(.+?)%>/g;
    const expr = /<%([\s\S]+?)%>/g;

    template = template
      .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
      .replace(expr, '`); \n $1 \n  echo(`');

    template = 'echo(`' + template + '`);';

    let script =
    `(function parse(data){
      let output = "";
      function echo(html){
        output += html;
      }
      ${ template }
      return output;
    })`;

    return script;
  }
  
  return eval(compile())(data);
}
