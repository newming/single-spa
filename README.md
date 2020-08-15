# 实现微前端框架

> 注意 rollup 2.x 需要 node 版本大于 10

> npm run dev 打开 http://localhost:3000/

# 微前端

- single-spa
- qiankun

## CSS隔离

1. BEM(Block Element Modifier)预定项目前缀
2. CSS-Modules打包时生成不冲突的选择器名
3. Shadow DOM真正意义上的隔离 attachShadow({mode: 'closed'})
4. css-in-js

## JS沙箱

1. 快照沙箱，多个子应用不可以使用
2. 代理沙箱，Proxy，代理可以实现多应用沙箱，把不同的应用使用不同的代理实现

