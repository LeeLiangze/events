// Events Page
var datatables = $('#events').DataTable({
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'info': true,
    'ajax': '/events/load',
    'autoWidth': true,
    "ordering": false,
    "columns": [
        {
            "data": "id",
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" name="event_id_' + data + '" value="' + data + '">';
            }
        },
        {"data": "id"},
        {"data": "user_id"},
        {"data": "title"},
        {"data": "description"},
        {"data": "start"},
        {"data": "end"},
        {
            "data": "is",
            render: function (data, type, row, meta) {
                return '<a class="" data-toggle="modal" id="event_id_' + row.id + '" data-target="#e-dialog-event" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-edit icon-white"></i> Edit</a>&nbsp;&nbsp;<a data-toggle="modal" onclick="removeData(' + row.id + ')" data-target="#dialog_user_delete" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-remove icon-white"></i> Delete</a>'
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
$("#start_dt").datetimepicker({
    timepicker: false,
    format: "Y-m-d",
});
//Date picker
$("#end_dt").datetimepicker({
    timepicker: false,
    format: "Y-m-d"
});

$('#e-dialog-event').on('show.bs.modal', function (event) {
    var modal = $(this);
    var button = $(event.relatedTarget);// Button that triggered the modal
    var data = button.data('whatever'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    initForm(modal, data);
});
var initForm = function (modal, data) {
    if (data) {
        modal.find('.modal-body input#e_id').val(data.id);
        modal.find('.modal-body input#title').val(data.title);
        modal.find('.modal-body input#description').val(data.description);
        modal.find('.modal-body input#start_dt').val(data.start);
        modal.find('.modal-body input#end_dt').val(data.end);
    } else {
        modal.find('.modal-body form input').val("");
    }
};
$('#e-dialog-event').find('.modal-footer #saveEvent').click(function () {
    $.ajax({
        type: "get",
        url: "/events/save",
        asyc: false,
        data: $("#e-events-form").serialize(),
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
                $('#e-dialog-event').modal('hide');
                datatables.ajax.url('/events/load').load();
            }
        }
    });
});
$("#events_refresh").on("click", function () {
    datatables.ajax.url('/events/load').load();
});
$("#events_edit").on("click", function () {
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
        url: "/events/delete",
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
                datatables.ajax.url('/events/load').load();
            }
        }
    });
};
$("#events_batch_remove").on("click", function () {
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

// Home page
var datatables_home = $('#events_home').DataTable({
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'info': true,
    'ajax': '/events/load',
    'autoWidth': true,
    "ordering": false,
    "columns": [
        {
            "data": "id",
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" name="event_id_' + data + '" value="' + data + '">';
            }
        },
        {"data": "id"},
        {"data": "user_id"},
        {"data": "title"},
        {"data": "description"},
        {"data": "start"},
        {"data": "end"},
        {
            "data": "is",
            render: function (data, type, row, meta) {
                return '&nbsp;&nbsp;<a data-toggle="modal" onclick="attendance(' + row.id + ')" data-target="#dialog_user_delete" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-check icon-white"></i> Attendance</a>'
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
$("#events_home_refresh").on("click", function () {
    datatables_home.ajax.url('/events/load').load();
});
var attendance = function (id) {
    var n = new Noty({
        text: 'Do you want to continue?',
        type: 'info',
        closeWith: ['button'],
        layout: 'topCenter',
        buttons: [
            Noty.button('YES', 'btn btn-success', function () {
                eventAttendance(id);
                n.close();
            }, {id: 'button1', 'data-status': 'ok'}),

            Noty.button('NO', 'btn btn-error btn-confirm', function () {
                n.close();
            })
        ]
    }).show();
};
var eventAttendance = function (id) {
    $.ajax({
        type: "get",
        url: "/events/home/attendance",
        asyc: false,
        data: {id: id},
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
                datatables_home.ajax.url('/events/load').load();
            }
        }
    });
};

// My Events Page
var datatables_my = $('#my-events').DataTable({
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'info': true,
    'ajax': '/events/my/load',
    'autoWidth': true,
    "ordering": false,
    "columns": [
        {
            "data": "id",
            "render": function (data, type, full, meta) {
                return '<input type="checkbox" name="event_id_' + data + '" value="' + data + '">';
            }
        },
        {"data": "id"},
        {"data": "user_id"},
        {"data": "title"},
        {"data": "description"},
        {"data": "start"},
        {"data": "end"},
        {
            "data": "is",
            render: function (data, type, row, meta) {
                return '<a class="" data-toggle="modal" id="my_event_id_' + row.id + '" data-target="#e-dialog-my-event" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-edit icon-white"></i> Edit</a>&nbsp;&nbsp;<a data-toggle="modal" onclick="removeMyData(' + row.id + ')" data-target="#dialog_user_delete" data-whatever=\'' + JSON.stringify(row) + '\'><i class="fa fa-remove icon-white"></i> Delete</a>'
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
$("#my_events_refresh").on("click", function () {
    datatables_my.ajax.url('/events/my/load').load();
});
//Date picker
$("#my_start_dt").datetimepicker({
    timepicker: false,
    format: "Y-m-d",
});
//Date picker
$("#my_end_dt").datetimepicker({
    timepicker: false,
    format: "Y-m-d"
});
$('#e-dialog-my-event').find('.modal-footer #saveMyEvent').click(function () {
    $.ajax({
        type: "get",
        url: "/events/save",
        asyc: false,
        data: $("#my-e-events-form").serialize(),
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
                $('#e-dialog-my-event').modal('hide');
                datatables_my.ajax.url('/events/my/load').load();
            }
        }
    });
});
var deleteMyData = function (ids) {
    $.ajax({
        type: "delete",
        url: "/events/delete",
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
                datatables_my.ajax.url('/events/my/load').load();
            }
        }
    });
};
var removeMyData = function (id) {
    var n = new Noty({
        text: 'Do you want to continue?',
        type: 'info',
        closeWith: ['button'],
        layout: 'topCenter',
        buttons: [
            Noty.button('YES', 'btn btn-success', function () {
                deleteMyData(id);
                n.close();
            }, {id: 'button1', 'data-status': 'ok'}),

            Noty.button('NO', 'btn btn-error btn-confirm', function () {
                n.close();
            })
        ]
    }).show();
};
$('#e-dialog-my-event').on('show.bs.modal', function (event) {
    var modal = $(this);
    var button = $(event.relatedTarget);// Button that triggered the modal
    var data = button.data('whatever'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    initMyForm(modal, data);
});
var initMyForm = function (modal, data) {
    if (data) {
        modal.find('.modal-body input#my_e_id').val(data.id);
        modal.find('.modal-body input#my_title').val(data.title);
        modal.find('.modal-body input#my_description').val(data.description);
        modal.find('.modal-body input#my_start_dt').val(data.start);
        modal.find('.modal-body input#my_end_dt').val(data.end);
    } else {
        modal.find('.modal-body form input').val("");
    }
};
