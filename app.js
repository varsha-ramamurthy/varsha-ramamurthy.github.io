// from data.js
var tableData = data;

// YOUR CODE HERE!
var tbody = d3.select("tbody");

// function to display data from data.js in a table
function buildUFOTable(UFOdata){
    tbody.html("");
    UFOdata.forEach(rowUFOData => {
        console.table(rowUFOData);
        let row = tbody.append("tr");

       console.table(Object.values(rowUFOData));
       Object.values(rowUFOData).forEach((val) => {
           let cell = row.append("td");
           cell.text(val);
       });
    });
}

// Filter by date
function clickUFOBtn(){
    d3.event.preventDefault()
    
    let date = d3.select("#datetime").property("value");
    let filteredUFOData = tableData;
    if (date){
        filteredUFOData = filteredUFOData.filter((row) => row.datetime === date);

    }

    buildUFOTable(filteredUFOData);
}



d3.selectAll("#filter-btn").on("click", clickUFOBtn);
buildUFOTable(tableData);