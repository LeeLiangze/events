var $table = $('#menus');
$(function() {
    $table.bootstrapTable({
        url: '/menus/tree',
        method: 'get',
        idField: 'menu_id',
        columns: [
            { field: 'check',  checkbox: true, formatter: function (value, row, index) {
                    if (row.check == true) {
                        // console.log(row.serverName);
                        return {  checked: true };
                    }
                }
            },
            { field: 'menu_name',  title: 'Name',sortable: true },
            { field: 'menu_flag', title: 'Flag', align: 'left'},
            { field: 'menu_url', title: 'URL', sortable: true, align: 'left'},
            { field: 'type', title: 'Type' , formatter: 'typeFormatter' },
            { field: 'menu_icon', title: 'Icon'},
            { field: 'created_at',  title: 'Created At', sortable: true,  align: 'left', formatter: 'timeFormatter'  },
            { field: 'modified_at', title: 'Modified AT', formatter: 'timeFormatter'},
            { field: 'operate', title: 'Actions', align: 'center', events : operateEvents, formatter: 'operateFormatter' },
        ],

        treeShowField: 'menu_name',
        parentIdField: 'parent_id',

        onResetView: function(data) {
            //console.log('load');
            $table.treegrid({
                initialState: 'collapsed',
                treeColumn: 1,
                expanderExpandedClass: 'glyphicon glyphicon-minus',
                expanderCollapsedClass: 'glyphicon glyphicon-plus',
                onChange: function() {
                    $table.bootstrapTable('resetWidth');
                }
            });
            $table.treegrid('getRootNodes').treegrid('expand');

        },
        onCheck:function(row){
            var datas = $table.bootstrapTable('getData');
        },

        onUncheck:function(row){
            var datas = $table.bootstrapTable('getData');
            //selectChilds(datas,row,"menu_id","parent_id",false);
            //$table.bootstrapTable('load', datas);
        },
    });


});

function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="RoleOfedit btn-small   btn-primary" style="margin-right:15px;"><i class="fa fa-pencil-square-o" ></i>&nbsp;Edit</button>',
        '<button type="button" class="RoleOfdelete btn-small   btn-primary" style="margin-right:15px;"><i class="fa fa-trash-o" ></i>&nbsp;Delete</button>'
    ].join('');

}
function typeFormatter(value, row, index) {
    if (value == '0') {  return 'Menu';  }
    if (value == '1') {  return 'Button'; }
    return '-';
}
function timeFormatter(value, row, index) {
    return value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : ""
}

window.operateEvents = {
    'click .RoleOfadd': function (e, value, row, index) {
        add({
            parent_id:row.menu_id
        });
    },
    'click .RoleOfdelete': function (e, value, row, index) {
        del(row.menu_id);
    },
    'click .RoleOfedit': function (e, value, row, index) {
        var data = {
            created_at: row.created_at,
            creator_id: row.creator_id,
            is_del: row.is_del,
            menu_flag: row.menu_flag,
            menu_icon: row.menu_icon,
            menu_id: row.menu_id,
            menu_name: row.menu_name,
            menu_url: row.menu_url,
            modified_at: row.modified_at,
            modified_id: row.modified_id,
            parent_id:row.parent_id,
            type: row.type
        }
        update(data);
    }
};

function selectChilds(datas,row,id,pid,checked) {
    for(var i in datas){
        if(datas[i][pid] == row[id]){
            datas[i].check=checked;
            selectChilds(datas,datas[i],id,pid,checked);
        };
    }
}

function selectParentChecked(datas,row,id,pid){
    for(var i in datas){
        if(datas[i][id] == row[pid]){
            datas[i].check=true;
            selectParentChecked(datas,datas[i],id,pid);
        };
    }
}

function getSelections() {
    var selRows = $table.bootstrapTable("getSelections");
    if(selRows.length == 0){
        new Noty({
            type: 'warning',
            layout: 'topCenter',
            text: 'Get Selections',
            timeout: '2000'
        }).show();
        return;
    }

    var postData = [];
    $.each(selRows,function(i) {
        postData.push(this.menu_id);
    });
    return postData;

}

function add(data) {
    var modal = $('#e-dialog-menu');
    $('#e-dialog-menu').modal({
        keyboard: true
    });
    initForm(modal, data);
}
function del(id) {
    removeData(id);
}
function update(data) {
    var modal = $('#e-dialog-menu');
    $('#e-dialog-menu').modal({
        keyboard: true
    });
    initForm(modal, data);
}

var initForm = function (modal, data) {
    $.ajax({
        type: "get",
        url: "/menus/tree?tree=1",
        asyc: false,
        error: function (error) {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: 'Server Error',
                timeout: '5000'
            }).show();
        },
        success: function (result) {
            if (result.error) {
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: result.msg || 'Error',
                    timeout: '5000'
                }).show();
            } else {
                var res = result.data;
                var auxArr = [];
                auxArr[0] = "<option value='0'>==Please select parent menu==</option>";

                $("div.parent_id").html("<select class=\"form-control\" id=\"e_parent_id\" name=\"e_parent_id\"></select>");
                for (var i = 0; i < res.length; i++) {
                    var menu_id = res[i]['menu_id'];
                    auxArr[i + 1] = "<option value='" + menu_id + "'>" + res[i]['menu_name'] + "</option>";
                }
                $('#e_parent_id').html(auxArr.join(''));

                if (data) {
                    modal.find('.modal-body input#e_id').val(data.menu_id || 0);
                    modal.find('.modal-body input#e_menu_name').val(data.menu_name || "");
                    modal.find('.modal-body input#e_menu_url').val(data.menu_url || "");
                    modal.find('.modal-body input#e_menu_icon').val(data.menu_icon || "");
                    modal.find('.modal-body input#e_menu_flag').val(data.menu_flag || "");
                    modal.find('.modal-body input#e_type').val(data.type || 0);
                    modal.find('.modal-body select#e_parent_id').val(data.parent_id || 0);
                } else {
                    modal.find('.modal-body form input').val("");
                    modal.find('.modal-body form select').val("0");
                }
            }
        }
    });
};

$('#e-dialog-menu').find('.modal-footer #saveMenu').click(function () {
    $.ajax({
        type: "get",
        url: "/menus/save",
        asyc: false,
        data: $("#e-menu-form").serialize(),
        error: function (error) {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: '内部错误，请稍后再试',
                timeout: '5000'
            }).show();
        },
        success: function (result) {
            if (result.error) {
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: result.msg || '保存角色失败',
                    timeout: '2000'
                }).show();
            } else {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    text: result.msg || '保存成功',
                    timeout: '2000'
                }).show();
                $('#e-dialog-menu').modal('hide');
                $table.bootstrapTable('refresh');
                showSidebarMenu();
            }
        }
    });
});
$("#menu_refresh").on("click", function () {
    $table.bootstrapTable('refresh');
});

$("#menu_add").on("click", function () {
    add({});
});
$("#menu_edit").on("click", function () {
    var ids = getSelections();
    if (ids.length != 1) {
        new Noty({
            type: 'warning',
            layout: 'topCenter',
            text: '请选择一条记录',
            timeout: '2000'
        }).show();
        return;
    }
    var id = ids[0];
    $.ajax({
        type: "get",
        url: "/menus/detail?menu_id=" + id,
        asyc: false,
        error: function (error) {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: '内部错误，请稍后再试',
                timeout: '5000'
            }).show();
        },
        success: function (result) {
            if (result.error) {
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: result.msg || '获取菜单详情失败',
                    timeout: '2000'
                }).show();
            } else {
                var modal = $('#e-dialog-menu');
                $('#e-dialog-menu').modal({
                    keyboard: true
                });
                initForm(modal, result.data);
            }
        }
    });
});
var deleteMenuData = function (ids) {
    $.ajax({
        type: "delete",
        url: "/menus/delete",
        asyc: false,
        data: {ids: ids},
        error: function (error) {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: '内部错误，请稍后再试',
                timeout: '5000'
            }).show();
        },
        success: function (result) {
            if (result.error) {
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: result.msg || '删除菜单失败',
                    timeout: '2000'
                }).show();
            } else {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    text: result.msg || '删除菜单成功',
                    timeout: '2000'
                }).show();
                $table.bootstrapTable('refresh');
            }
        }
    });
};
//批量删除
$("#menu_batch_remove").on("click", function () {
    var ids = getIds();
    if (ids.length == 0) {
        new Noty({
            type: 'warning',
            layout: 'topCenter',
            text: '至少要选择一条记录',
            timeout: '2000'
        }).show();
        return;
    }
    removeData(ids.join(","));
});
var removeData = function (id) {
    var n = new Noty({
        text: '你要继续吗?',
        type: 'info',
        closeWith: ['button'],
        layout: 'topCenter',
        buttons: [
            Noty.button('YES', 'btn btn-success', function () {
                deleteMenuData(id);
                n.close();
            }, {id: 'button1', 'data-status': 'ok'}),

            Noty.button('NO', 'btn btn-error btn-confirm', function () {
                n.close();
            })
        ]
    }).show();
};
