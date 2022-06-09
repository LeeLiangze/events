var datatables = $('#roles').DataTable({
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'info': true,
    'ajax': '/roles/load',
    'autoWidth': true,
    "ordering": false,
    "columns": [
        {
            "data": "role_id",
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" name="role_id_' + data + '" value="' + data + '">';
            }
        },
        {"data": "role_name"},
        {"data": "description"},
        {"data": "created_at"},
        {"data": "modified_at"},
        {
            "data": "is",
            render: function (data, type, row, meta) {
                return '<a class="" data-toggle="modal" id="role_id_' + row.role_id + '" data-target="#e-dialog-role" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-edit icon-white"></i> Edit</a>&nbsp;&nbsp;<a data-toggle="modal" onclick="removeData(' + row.role_id + ')" data-target="#dialog_user_delete" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-remove icon-white"></i> Delete</a>'
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
//编辑
$('#e-dialog-role').on('show.bs.modal', function (event) {
    var modal = $(this);
    var button = $(event.relatedTarget);// Button that triggered the modal
    var data = button.data('whatever'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    initForm(modal, data);
});
var initForm = function (modal, data) {
    if (data) {
        modal.find('.modal-body input#e_id').val(data.role_id);
        modal.find('.modal-body input#e_role_name').val(data.role_name);
        modal.find('.modal-body input#e_description').val(data.description);
    } else {
        modal.find('.modal-body form input').val("");
    }
};
$('#e-dialog-role').find('.modal-footer #saveRole').click(function () {
    $.ajax({
        type: "get",
        url: "/roles/save",
        asyc: false,
        data: $("#e-role-form").serialize(),
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
                    timeout: '2000'
                }).show();
            } else {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    text: result.msg || 'Success',
                    timeout: '2000'
                }).show();
                $('#e-dialog-role').modal('hide');
                datatables.ajax.url('/roles/load').load();
            }
        }
    });
});
$("#role_refresh").on("click", function () {
    datatables.ajax.url('/roles/load').load();
});
$("#role_edit").on("click", function () {
    var ids = getIds();
    if (ids.length != 1) {
        new Noty({
            type: 'warning',
            layout: 'topCenter',
            text: 'At least one record must be selected',
            timeout: '2000'
        }).show();
        return;
    }
    var id = ids[0];
    var data = $("a#role_id_" + id).attr("data-whatever");
    var modal = $('#e-dialog-role');
    $('#e-dialog-role').modal({
        keyboard: true
    });
    initForm(modal, JSON.parse(data));
});
var deleteRoleData = function (ids) {
    $.ajax({
        type: "delete",
        url: "/roles/delete",
        asyc: false,
        data: {ids: ids},
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
                    timeout: '2000'
                }).show();
            } else {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    text: result.msg || 'Success',
                    timeout: '2000'
                }).show();
                datatables.ajax.url('/roles/load').load();
            }
        }
    });
};
//批量删除
$("#role_batch_remove").on("click", function () {
    var ids = getIds();
    if (ids.length == 0) {
        new Noty({
            type: 'warning',
            layout: 'topCenter',
            text: 'At least one record must be selected\n',
            timeout: '2000'
        }).show();
        return;
    }
    removeData(ids.join(","));
});
var removeData = function (id) {
    var n = new Noty({
        text: 'Do you want to continue?',
        type: 'info',
        closeWith: ['button'],
        layout: 'topCenter',
        buttons: [
            Noty.button('YES', 'btn btn-success', function () {
                deleteRoleData(id);
                n.close();
            }, {id: 'button1', 'data-status': 'ok'}),

            Noty.button('NO', 'btn btn-error btn-confirm', function () {
                n.close();
            })
        ]
    }).show();
};
