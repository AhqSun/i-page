define('iPage', ['knockout'], function (ko) {
    ko.components.register('i-page', {
        viewModel: function (params) {

            var self = this;
            //读入分页大小
            var pageSize = parseInt(+ko.unwrap(params.pageSize)) || 10;

            //初始化当前页为0
            self.curPage = ko.observable(0);
            //读入最大页数
            self.maxPage = ko.observable(0);
            //读入按钮个数
            var buttonNum = +ko.unwrap(params.buttonNum) || 5;
            if (buttonNum < 1) {
                buttonNum = 1;
            }
            //保证按钮个数是奇数
            if (buttonNum % 2 === 0) {
                buttonNum += 1;
            }



            self.iChange = params.iChange;
            //生成按钮方法
            function calcButton(curPage, num, maxPage) {
                //页数为0，则直接返回
                if (maxPage < 1) {
                    return [];
                }

                if (maxPage < num) {
                    num = maxPage;
                }
                var list = [curPage];
                function calc(curPage, num, flag) {
                    if (num > 1) {
                        var next = num - 1;

                        var cur = flag ? list[list.length - 1] : list[0];

                        if (flag) {
                            if (cur < maxPage - 1) {
                                list.push(cur + 1);
                            }
                            else {
                                next = num;
                            }
                        }
                        else {
                            if (cur < 1) {
                                next = num;
                            }
                            else {
                                list.unshift(cur - 1);
                            }
                        }
                        calc(curPage, next, !flag);
                    }
                }
                calc(curPage, num);

                if (list[0] != 0) {
                    list.unshift(-1);
                }

                if (list[list.length - 1] != maxPage - 1) {
                    list.push(-1);
                }
                return list;
            }

            //点击按钮，事件回调
            self.callback = function (num) {
                if (typeof (self.iChange) === "function") {
                    pageSize = parseInt(+ko.unwrap(params.pageSize)) || 10;
                    self.iChange(num, pageSize, function (count) {
                        var numCount = parseInt(+count || 0);
                        var maxPage = parseInt(numCount / pageSize);

                        if (numCount % pageSize !== 0) {
                            maxPage += 1;
                        }
                        self.maxPage(maxPage);
                        self.list.removeAll();
                        ko.utils.arrayForEach(calcButton(num, buttonNum, self.maxPage()), function (item) {
                            self.list.push(item);
                        });
                        self.curPage(num);
                    });

                }
            };

            //生成按钮
            self.list = ko.observableArray([]);


            //下一页
            self.nextPage = function () {
                if (self.curPage() < self.maxPage() - 1) {
                    self.callback(self.curPage() + 1);
                }
            };
            //上一页
            self.prevPage = function () {
                if (self.curPage() > 0) {
                    self.callback(self.curPage() - 1);
                }
            };

            //初始化，请求第一页
            self.callback(0);

            var watch = params.watch ? [].concat(params.watch) : [];
            ko.utils.arrayForEach(watch, function (item) {
                if (ko.isObservable(item)) {
                    item.subscribe(function () {
                        self.callback(0);
                    });
                }
            })

        },
        template: '<ul class="pagination pagination-sm" data-bind="if:maxPage()>0">\
                            <li data-bind="css:{disabled:curPage()==0}">\
                                <a href="javascript:void(0);" data-bind="click:prevPage">&lt;&lt;</a>\
                            </li>\
                            <!-- ko foreach: list -->\
                                <li  data-bind="css:{active:$data===$parent.curPage()}">\
                                    <!-- ko if: $data>-1 -->\
                                        <a href="javascript:void(0);" data-bind="text:$data+1,click:$parent.callback">{{$data+1}}</a>\
                                    <!-- /ko -->\
                                    <!-- ko if: $data<0 -->\
                                        <a href="javascript:void(0);"data-bind="click:function(){$parent.callback($index()==0?0:$parent.maxPage()-1);}" ng-if="item<0">...</a>\
                                    <!-- /ko -->\
                                </li>\
                            <!-- /ko -->\
                            <li  data-bind="css:{disabled:curPage()==maxPage()-1||maxPage()<1}">\
                                <a href="javascript:void(0);" data-bind="click:nextPage">&gt;&gt;</a>\
                            </li>\
                        </ul>'
    });
});