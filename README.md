# SimpleDeployer

[![Build Status](https://travis-ci.org/yourtion/SimpleDeployer.svg?branch=master)](https://travis-ci.org/yourtion/SimpleDeployer)

基于 Git WebHook 的超简单部署工具。

## 使用

### 初始化项目

```bash
clone https://github.com/yourtion/SimpleDeployer.git 
cd SimpleDeployer
cp config.js.sample config.js
```

### 配置任务

编辑 `config.js`：

```javascript
// 配置端口
config.port = 3000;

// 添加任务
config.tasks['updateWeb'] = {
  token: 'ssss'
  command: 'cd /path/to/website && git pull'
});
```

- `tasks['name']` Git webhook 请求的路径；
- `command` Git webhook 请求时执行的命令；
- `cwd` 工作目录；
- `token` 请求时需要简单验证的参数；
- `type` （可选）获取分支的系统类型（gitlab、gogs）；
- `branch` （可选）针对特定分支执行（master...）；

### 启动项目

Node.js：

```
node index
```

pm2：

```
npm run pm2
```

### 设置 WebHook

在 Git 管理系统的 WebHook 界面添加 `Push` 触发事件。URL 设置为 `http(s)://SimpleDeployerServer/{task:name}`

> 假设 SimpleDeployer 部署在 `server.com:8000`，task.name 为 `updateWeb`，task.token 为 `8K0TMEAF73`
>
> 那么 webhook 就是 `http://server.com:8000/updateWeb?token=8K0TMEAF73`
> 
> `Trigger` 为 `Push events`
