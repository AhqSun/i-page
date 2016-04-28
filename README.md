i-page
=============

基于knockout的分页组件

0. 用法简单
0. 可用于同步分页与异步分页






用法
-----

* 使用全部参数

```html
<i-page params="{iChange:pageChange,watch:[searchKey,status],buttonNum:9}"></i-page>
```

* 最简用法

```html
<i-page params="{iChange:pageChange}"></i-page>
```

```javascript
  self.pageNoChange = function (pageNo, pageSize, callback) {
            self.pageNo(pageNo);           
            callback(self.list().length);
        };
```
* html参数说明
  > iChange 

    当页码发生改变时，被组件调用

  > watch

     传入需要跟踪变化的参数

  > buttonNum

     显示分页按钮个数，默认为5

* javascript参数说明

  > pageNo

    当前页码

  > pageSize

    当前分页大小

  > callback

    调用重新生成按钮

关于作者
------------
   如有bug,请联系 [sunyun321@sina.com](mailto:sunyun321@sina.com)
