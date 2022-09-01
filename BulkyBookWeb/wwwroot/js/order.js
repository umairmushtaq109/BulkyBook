var dataTable;

$(document).ready(function () {
    var url = window.location.search;
    if (url.includes("inprocess")) {
        loadDataTable("inprocess");
    } else {
        if (url.includes("completed")) {
            loadDataTable("completed");
        } else {
            if (url.includes("pending")) {
                loadDataTable("pending");
            } else {
                if (url.includes("approved")) {
                    loadDataTable("approved");
                } else {
                    loadDataTable("all");
                }
            }
        }
    }
    
});

function loadDataTable(status) {
    dataTable = $('#datatable').DataTable(
        {
            "processing": true,
            "ajax": {
                "url": "/Admin/Order/GetAll?status=" + status
            },
            "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            "columns": [
                { "data": "id", "width": "5%" },
                { "data": "name", "width": "25%" },
                { "data": "phoneNumber", "width": "15%" },
                { "data": "applicationUser.email", "width": "15%" },
                { "data": "orderStatus", "width": "15%" },
                { "data": "orderTotal", "width": "10%" },
                {
                    "data": "id",
                    "render": function (data, row) { //HTML Code should be on same line along with return statement (Spent too much time on this error)
                        return `<div class="w-75 btn-group" role="group">
                                    <a href="/Admin/Order/Details?orderId=${data}" class="btn btn-info" ><i class="bi bi-pencil-square"></i>  Details</a>                                    
                                </div>`;
                    },                    
                    "width": "25%"
                }
            ]
        }
    );
}