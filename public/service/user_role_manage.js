$("#e_roles").selectpicker();
$('#dialog_user_role').on('show.bs.modal', function (event) {
    $("#e_roles").empty();
    var modal = $(this);
    var button = $(event.relatedTarget);// Button that triggered the modal
    var data = button.data('whatever'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    //var data = JSON.parse(recipient);
    var role_id = data.role_id + "";
    $.ajax({
        type: "get",
        url: "/user_role/getRole",
        asyc: false,
        error: function (error) {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                text: 'Server Error',
                timeout: '5000'
            }).show();
            $('#dialog_user_role').modal('hide');
        },
        success: function (result) {
            if (result.error) {
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    text: result.msg || 'Error',
                    timeout: '5000'
                }).show();
                $('#dialog_user_role').modal('hide');
            } else {
                var tempAjax = "";
                var data = result.data;
                $.each(data, function (i, n) {
                    tempAjax += "<option value='" + n.role_id + "'>" + n.role_name + "</option>";
                });
                $("#e_roles").empty();
                $("#e_roles").append(tempAjax);
                $('#e_roles').selectpicker('render');
                $('#e_roles').selectpicker('refresh');
                if (role_id != "") {
                    $('#e_roles').selectpicker('val', role_id.indexOf(",") != -1 ? role_id.split(",") : role_id);
                }
            }
        }
    });
    modal.find('.modal-body input#e_id').val(data.id);
    modal.find('.modal-body label#e_user_name').html(data.name);
    modal.find('.modal-body input#e_role').val(data.role_name);
});
$('#dialog_user_role').find('.modal-footer #saveUserRole').on("click", function () {
    var data = $("#e-user-role-form").serialize();
    $.ajax({
        type: "post",
        url: "/user_role/setRole",
        data: data,
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
                    timeout: '2000'
                }).show();
                $('#dialog_user_role').modal('hide');
                window.location.href='/user_role';
            }
        }
    });
});
var datatable = $('#users').DataTable({
    'bProcessing': true,
    'paging': true,
    'lengthChange': true,
    'searching': false,
    'info': true,
    'ajax': '/user_role/load',
    'autoWidth': true,
    "ordering": false,
    "columns": [
        {"data": "id"},
        {"data": "name"},
        {"data": "user_name"},
        {"data": "role_name"},
        {
            "data": "is",
            render: function (data, type, row, meta) {
                return '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#dialog_user_role" data-whatever=\'' + JSON.stringify(row) + '\'><i class="glyphicon glyphicon-edit icon-white"></i> Edit</button>'
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
$("#user-search").on("click", function () {
    datatable.ajax.url('/user_role/load?s_user_name=' + $("#s_user_name").val() + '&s_name=' + $("#s_name").val()).load();
});
