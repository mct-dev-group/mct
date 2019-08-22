const Koa = require('koa');
const cors = require('koa2-cors');
const router = require('koa-router')();
const Sequelize = require('sequelize');

const app = new Koa();
const sequelize = new Sequelize('mysql://yuanjing:yuanjing123456@47.105.123.78/bigdataactiveplatform',{
    logging:false,
    dialectOptions: {
        dateStrings: true,
        typeCast: true 
    },
});
sequelize.authenticate()
    .then(() => {
        console.log('数据库连接成功！');
    })
    .catch(err => {
        console.error('数据库连接失败：', err);
    });

app.use(cors());

router.get('/sqlservice/v1/executeSql', async ctx => {
    if(ctx.querystring !== "" && ctx.query.sql){
        try {            
            let result = await sequelize.query(ctx.query.sql,{type: sequelize.QueryTypes.SELECT});
            ctx.body=result;
        } catch (error) {
            ctx.response.status = 400;
            ctx.response.body = error.message;
            console.error(`[SQL]：${error.sql}\n[${error.name}]：${error.message}`);
        }
    }else{
        ctx.response.status = 400;
        ctx.response.body = 'Bad Request';        
    }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8014,()=>{    
    console.log("数据库查询服务已启动 端口：8014");
});