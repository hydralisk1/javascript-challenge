// YOUR CODE HERE!
// Set lines per page and initialize page number
const line_per_page = 10;
var page = 0;

// Function to correct date. "01/01/2010" ==> "1/1/2010"
function date_check(datetime){
    var splited_date = datetime.split("/")
    // If input value type is not mm/dd/yyyy, return the original value
    if (splited_date.length !== 3 || datetime === "")
        return datetime;
    // If the first number is 0, remove it and return.
    var checked_date = parseInt(splited_date[0]) + "/" + parseInt(splited_date[1]) + "/" + parseInt(splited_date[2]);
    return checked_date;
}

function table_view(){
    // If it's not the first visit, don't refresh this page but remove the table
    if (d3.event !== null){
        d3.event.preventDefault();
        d3.select("#table-area").html("");
    }

    // Store the input values in an array
    var input_value = {
        datetime: date_check(d3.select("#datetime").property("value")),
        city: d3.select("#city").property("value"),
        state: d3.select("#state").property("value"),
        country: d3.select("#country").property("value"),
        shape: d3.select("#shape").property("value")
    };
    
    var filtered_data = data;
    // Filtering data by each entered value.
    Object.keys(input_value).forEach(key =>{
        if (input_value[key] !== "")
            filtered_data = filtered_data.filter(data => data[key].toLowerCase() === input_value[key].toLowerCase());
    });

    // If the filtered data is empty, print the error message instead of the table
    if (filtered_data.length === 0){
        d3.select("#table-area").text(`Data not found!`);
        // Hide page number and navi buttons
        d3.selectAll("#navi").style("display", "none");
    }
    else{
        // Select table area and append table tag
        var table = d3.selectAll("#table-area").append("table").attr("class", "table table-striped");
        // Append thead and tr tags to the table
        var header = table.append("thead").append("tr");
        // Append th tags to the thead and put headers in the th tags
        header
            .selectAll("th")
            .data(Object.keys(filtered_data[0]))
            .enter()
            .append("th")
            .text(th => th)
            .attr("class", "table-head");

        // Append tbody tag to the table
        var table_body = table.append("tbody");

        // Append tr tags to the tbody tag
        var rows = table_body.selectAll("tr")
            .data(filtered_data.map(obj => Object.values(obj)).slice(page * line_per_page, (page + 1) * line_per_page))
            .enter()
            .append("tr");

        // Append td tags to the tr tags and put data in the td tags
        rows.selectAll("td")
            .data(td => td)
            .enter()
            .append("td")
            .text(td => td);

        // Get the last page number
        var last_page = Math.ceil(filtered_data.length / line_per_page);
        // Put the page number
        d3.selectAll("#page_number").text(`Page ${page+1} of ${last_page}`);

        // If navi buttons and page number are hidden, switch display to flex
        if (d3.selectAll("#navi").style("display") == "none")
            d3.selectAll("#navi").style("display", "flex");

        var prev_button = d3.selectAll("#prv");
        var next_button = d3.selectAll("#next");

        // If this page is not the first page, make the previous page button enable, and set the event listener for the previous page button
        // If this page is the first page, make the previous page button disable
        if (page > 0){
            prev_button.attr("class", "btn btn-outline-dark btn-sm");
            d3.select("#prv").on("click", function(){
                page--;
                table_view();
            });
        }else{
            prev_button.attr("class", "btn btn-outline-dark btn-sm disabled");
        }

        // If this page is not the last page, make the next page button enable, and set the event listener for the button
        // If this page is the last page, make the next page button disable
        if (page+1 < last_page){
            next_button.attr("class", "btn btn-outline-dark btn-sm");
            d3.select("#next").on("click", function(){
                page++;
                table_view();
            });
        }else{
            next_button.attr("class", "btn btn-outline-dark btn-sm disabled");
        }
    }
}

// Set listeners for the form and the button
d3.select("form").on("submit", function() {
    page = 0;
    table_view();
});

d3.select("#filter-btn").on("click", function() {
    page = 0;
    table_view();
});

// Set a listener for the toggle button
d3.select("#toggle").on("click", function() {
    var hidden_input = d3.selectAll("#hidden");
    console.log(hidden_input.style("display"));
    if (hidden_input.style("display") === "none"){
        hidden_input.style("display", "flex");
        d3.select("#toggle").text("⊼");
    }else{
        hidden_input.style("display", "none");
        d3.select("#toggle").text("⊻");
    }
});

// run table_view function initially
table_view();
