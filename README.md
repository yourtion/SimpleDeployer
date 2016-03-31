# SimpleDeployer

基于 Git WebHook 的超简单部署工具。

## 使用

### 初始化项目

```bash
clone https://github.com/yourtion/SimpleDeployer.git 
cd SimpleDeployer
npm install
cp config.js.sample config.js
```

### 配置任务

编辑 `config.js`：

```javascript
// 配置端口
config.port = 3000;

// 添加任务
config.tasks.push({
  name: 'updateWeb',
  command: 'cd /path/to/website && git pull'
});
```

- `name` Git webhook 请求的路径；
- `command` Git webhook 请求时执行的命令；

### 启动项目

Node.js：

```
node index
```

pm2：

```
pm2 start index -n SimpleDeployer
```

### 设置 WebHook

在 Git 管理系统的 WebHook 界面添加 `Push` 触发事件。URL 设置为 `http(s)://SimpleDeployerServer/{task:name}`

> 假设 SimpleDeployer 部署在 `server.com:8000`，task.name 为 `updateWeb`
>
> 那么 webhook 就是 `http://server.com:8000/updateWeb`
> 
> `Trigger` 为 `Push events`

