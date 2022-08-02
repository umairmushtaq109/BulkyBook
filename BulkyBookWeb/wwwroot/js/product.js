var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#datatable').DataTable(
        {
            "processing": true,
            "ajax": {
                "url": "/Admin/Product/GetAll"
            },
            "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            "columns": [
                { "data": "title", "width": "15%" },
                { "data": "isbn", "width": "15%" },
                { "data": "author", "width": "15%" },
                { "data": "price", "width": "15%" },
                { "data": "category.name", "width": "15%" },
                {
                    "data": "id",
                    "render": function (data, row) { //HTML Code should be on same line along with return statement (Spent too much time on this error)
                        return `<div class="w-75 btn-group" role="group">
                                    <a href="/Admin/Product/Upsert?id=${data}" class="btn btn-info" ><i class="bi bi-pencil-square"></i>  Edit</a>
                                    <a class="btn btn-danger" onClick=Delete('/Admin/Product/Delete/${data}')><i class="bi bi-trash-fill"></i> Delete</a>    
                                </div>`;
                    },                    
                    "width": "25%"
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