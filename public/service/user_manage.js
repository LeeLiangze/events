var datatable = $('#users').DataTable({
    'bProcessing': true,
    'display': true,
    'paging': true,
    'lengthChange': true,
    'searching': false,
    'info': true,
    'ajax': '/users/load',
    'autoWidth': true,
    "ordering": false,
    "columns": [
        {
            "data": "event_id",
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" name="user_id_' + data + '" value="' + data + '">';
            }
        },
        {"data": "name"},
        {"data": "user_name"},
        {"data": "sex"},
        {"data": "birthday"},
        {"data": "phone"},
        {"data": "mail"},
        {"data": "created_at"},
        {"data": "modified_at"},
        {
            "data": "is",
            render: function (data, type, row, meta) {
                var sex = row.sex;
                if (sex == "Female") {
                    row.sex = 0;
                }
                if (sex == "Male") {
                    row.sex = 1;
                }
                var operate = "";
                operate = operate + '<a class="" data-toggle="modal" id="user_id_' + row.id + '" data-target="#e-dialog-user" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-edit icon-white"></i> Edit</a>&nbsp;&nbsp;';
                operate = operate + '<a name="' + row.id + '" onclick="removeData(' + row.id + ')" class="user_remove"><i class="fa fa-remove icon-white"></i> Delete</a>';
                return operate;
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
//Date picker
$("#e_birthday").datetimepicker({
    timepicker: false,
    format: "Y-m-d",
    maxDate: "+1970/01/01"
});

$("#user-search").on("click", function () {
    datatable.ajax.url('/users/load?s_user_name=' + $("#s_user_name").val() + '&s_name=' + $("#s_name").val()).load();
});

$("#user_refresh").on("click", function () {
    datatable.ajax.url('/users/load?s_user_name=' + $("#s_user_name").val() + '&s_name=' + $("#s_name").val()).load();
});
var initForm = function (modal, data) {
    if (data) {
        console.log(data)
        modal.find('.modal-body label#user_password_desc').show();
        modal.find('.modal-body input#e_id').val(data.id);
        modal.find('.modal-body input#e_user_name').val(data.user_name);
        modal.find('.modal-body input#e_name').val(data.name);
        modal.find('.modal-body input#e_birthday').val(data.birthday);
        modal.find('.modal-body input#e_phone').val(data.phone);
        modal.find('.modal-body input#e_mail').val(data.mail);
        modal.find('.modal-body select#e_sex').val(data.sex);
    } else {
        modal.find('.modal-body label#user_password_desc').hide();
        modal.find('.modal-body form input').val("");
        modal.find('.modal-body form select').val("0");
    }
    modal.find('.modal-body input#e_password').val("");
};

$('#e-dialog-user').on('show.bs.modal', function (event) {
    var modal = $(this);
    var button = $(event.relatedTarget);// Button that triggered the modal
    var data = button.data('whatever'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    initForm(modal, data);
});

$("#user_edit").on("click", function () {
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
    var data = $("a#user_id_" + id).attr("data-whatever");
    var modal = $('#e-dialog-user');
    $('#e-dialog-user').modal({
        keyboard: true
    });
    initForm(modal, JSON.parse(data));
});
$('#e-dialog-user').find('.modal-footer #saveUser').click(function () {
    var password = $("#e_password").val();
    var data = $("#e-menu-role-form").serialize();
    var dts = data.split("&");
    var str = "";
    var list = [];
    for (var i=0; i<dts.length; i++) {
        var dt = dts[i];
        if(dt.indexOf("e_password")>-1 && (password != "" && password.trim() != "")) {
            list.push("e_password=" + hex_md5(password));
        } else {
            list.push(dt);
        }
    }
    data = list.join("&");
    $.ajax({
        type: "get",
        url: "/users/save",
        asyc: false,
        data: data,
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
                $('#e-dialog-user').modal('hide');
                datatable.ajax.url('/users/load?s_user_name=' + $("#s_user_name").val() + '&s_name=' + $("#s_name").val()).load();
            }
        }
    });
});
var deleteUserData = function (ids) {
    $.ajax({
        type: "delete",
        url: "/users/delete",
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
                datatable.ajax.url('/users/load?s_user_name=' + $("#s_user_name").val() + '&s_name=' + $("#s_name").val()).load();
            }
        }
    });
};
$("#user_batch_remove").on("click", function () {
    var ids = getIds();
    if (ids.length == 0) {
        new Noty({
            type: 'warning',
            layout: 'topCenter',
            text: 'At least one record must be selected',
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
                deleteUserData(id);
                n.close();
            }, {id: 'button1', 'data-status': 'ok'}),

            Noty.button('NO', 'btn btn-error btn-confirm', function () {
                n.close();
            })
        ]
    }).show();
};
