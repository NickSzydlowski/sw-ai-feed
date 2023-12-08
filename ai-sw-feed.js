// configure table columns
  function createTableColumns(){

    var tableColumns =   [
        {'data': 'type', 'title': 'Document Type', "defaultContent": "", 'visible':false},
        {'data': 'title', 'title': 'Title', 'className':'sw-title', "defaultContent": "", 'orderable':false},
        {'data': 'author', 'title': 'Author(s)', 'className':'sw-author', "defaultContent": "", 'orderable':false},
        {'data': 'year', 'title': 'Year', 'className':'sw-year', "defaultContent": "", 'orderable':false},
        {'data': 'url', 'title': 'URL', 'className':'sw-link', "defaultContent": "", 'orderable':false, "render": function(data, type, row, meta){
              if(type === 'display'){
                  data = '<a target="_blank" href="' + data + '">' + 'More information' + '</a>';
            }
            return data;
         }},

       ];
  return tableColumns;
}

$(document).ready(function(){

  $('#scholarWorksTable').html('<table cellpadding="0" cellspacing="0" border="0" class="display table" id="data-table-container" style="width:100%"></table>');

  //this function creates the datatable and selects configuration options
  var oTable = $('#data-table-container').DataTable({
    'dom':'ftr',
    'pageLength': 1500,
    'order' : [[0, 'asc'], [3, 'desc'], [1, 'asc']],
    "language": {
      "search": "Search AI Research from SJSU Authors:"
    },
    'columns': createTableColumns(),
     'ajax': {
     url: 'output.json',
     cache: true,
       'dataSrc': function(json) {
         var myType;
         var allAuthors;
         var pubDate;
         var secureLink;
         var myData = json['results']; //spreadsheet data lives in an array with the name values
         //rewrite data to an object with key-value pairs. This is also a chance to rename or ignore columns
         myData= myData.map(function( n, i ) {
          //handle type - third entry is usually better than the second but not always present
           if (n['document_type'][2]) {
             myType = n['document_type'][2]
            } else {
              myType = n['document_type'][1]
          };
          //list all authors
          allAuthors = n['author'].join(", ");
          pubDate = new Date(n['publication_date']);
          pubDate = pubDate.getFullYear();

          secureLink = n['url'].replace("http","https");

             var myObject = {
               url:secureLink,
               title:n['title'],
               type:myType,
               author:allAuthors,
               year:pubDate
             };
             return myObject;
         });
         myData.splice(0,1); //remove the first row, which contains the orginal column headers
         return myData;
       }
     },
     rowGroup: {
       dataSrc: 'type'
   }

  });

});
