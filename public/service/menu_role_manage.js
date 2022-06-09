var setting = {
    view: {
        addHoverDom: false,
        removeHoverDom: false,
        dblClickExpand: false,
        selectedMulti: false
    },
    check: {
        enable: true,
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        }
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "menu_id",
            pIdKey: "parent_id",
        },
        key: {
            name: "menu_name"
        },
    },
    edit: {
        enable: false,
        treeNodeKey: "menu_id",
        treeNodeParentKey: "parent_id",
        showLine: true,
    }
};

var treeObj = null;
$('#dialog_menu_role').on('show.bs.modal', function (event) {
    var modal = $(this);
    var button = $(event.relatedTarget);
    var data = button.data('whatever');
    var role_id = data.role_id;
    $.ajax({
        type: "get",
        url: "/menu_role/get_menu?role_id=" + role_id,
        asyc: false,
        error: function (error) {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: 'Server Error',
                timeout: '5000'
            }).show();
            $('#dialog_menu_role').modal('hide');
        },
        success: function (result) {
            if (result.error) {
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: result.msg || 'Error',
                    timeout: '5000'
                }).show();
                $('#dialog_menu_role').modal('hide');
            } else {
                treeObj = $.fn.zTree.init($("#busTree"), setting, result.data);
            }
        }
    });
    modal.find('.modal-body input#e_id').val(data.role_id);
    modal.find('.modal-body label#e_role_name').html(data.role_name);
});

$('#dialog_menu_role').find('.modal-footer #saveMenuRole').click(function () {
    var menus = [];
    var nodes = treeObj.getCheckedNodes(true);
    for (var i = 0; i<nodes.length; i++) {
        menus.push(nodes[i]['menu_id']);
    }
    $.ajax({
        type: "post",
        url: "/menu_role/setMenu",
        data: {
            e_menus: menus.join(","),
            e_id: $('#e_id').val()
        },
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
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    text: 'Success',
                    timeout: '5000'
                }).show();
                $('#dialog_menu_role').modal('hide');
                showSidebarMenu();
                //datatable.ajax.url('/menu_role/load').load();
                window.location.href = "/menu_role";
            }
        }
    });
});
var datatable = $('#roles').DataTable({
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'info': true,
    'ajax': '/menu_role/load',
    'autoWidth': true,
    "ordering": false,
    "columns": [
        {"data": "role_id"},
        {"data": "role_name"},
        {"data": "description"},
        {
            "data": "is",
            render: function (data, type, row, meta) {
                return '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#dialog_menu_role" data-whatever=\'' + JSON.stringify(row) + '\'><i class="glyphicon glyphicon-edit icon-white"></i> Menu Permissions</button>'
            }
        }
    ],
    "language": {
        "emptyTable": "No Data",
        "info": "Showing _START_ to _END_ of _TOTAL_",
        "infoEmpty": "No Data",
        "infoFiltered": "(Filtered from _MAX_ records)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Show _MENU_ entries",
        "loadingRecords": "Loading...",
        "processing": "Processing...",
        "search": "Search:",
        "zeroRecords": "No matching records found",
        "paginate": {
            "first": "First",
            "last": "Last",
            "next": "Next",
            "previous": "Previous"
        }
    },
    "serverSide": true
});
