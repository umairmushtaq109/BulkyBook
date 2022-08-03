﻿var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#datatable').DataTable(
        {
            "processing": true,
            "ajax": {
                "url": "/Admin/Company/GetAll"
            },
            "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            "columns": [
                { "data": "name", "width": "15%" },
                { "data": "streetAddress", "width": "15%" },
                { "data": "city", "width": "15%" },
                { "data": "state", "width": "10%" },
                { "data": "postalCode", "width": "15%" },
                { "data": "phoneNumber", "width": "15%" },
                {
                    "data": "id",
                    "render": function (data, row) { //HTML Code should be on same line along with return statement (Spent too much time on this error)
                        return `<div class="w-75 btn-group" role="group">
                                    <a href="/Admin/Company/Upsert?id=${data}" class="btn btn-info" ><i class="bi bi-pencil-square"></i>  Edit</a>
                                    <a class="btn btn-danger" onClick=Delete('/Admin/Company/Delete/${data}')><i class="bi bi-trash-fill"></i> Delete</a>    
                                </div>`;
                    },                    
                    "width": "30%"
                }
            ]
        }
    );
}

function Delete(url) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', 
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (data) {
                    if (data.success) {
                        dataTable.ajax.reload();
                        toastr.success(data.message);
                    } else {
                        toastr.error(data.message);
                    }
                }
            });
        }
    })
}