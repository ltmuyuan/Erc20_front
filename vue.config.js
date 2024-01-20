// vue.config.js
const path =  require('path');
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
    devServer: {
            overlay: { // 让浏览器 overlay 同时显示警告和错误
              warnings: true,
              errors: true
            },
            host: "localhost",
            port: 8080, // 端口号
            https: false, // https:{type:Boolean}
            open: false, //配置自动启动浏览器
            hotOnly: true, // 热更新
            // proxy: 'http://localhost:8080'   // 配置跨域处理，只有一个代理
            proxy: { //配置多个跨域
                "/absc": {
                    target: "https://absc.app",
                    changeOrigin: true,
                    // ws: true,//websocket 支持
                    secure: false,
                    rewrite: (path) => path.replace(/^\/absc/, ""),
                },
            }
        }
}