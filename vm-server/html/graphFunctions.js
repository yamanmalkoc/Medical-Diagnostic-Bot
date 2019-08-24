/*
    These are functions that are used to create graphs and populate the results page. 
    The template code for making graphs was taken from: 
        https://developers.google.com/chart/interactive/docs/gallery/barchart
    

*/

const WIDTH = 340;
const HEIGHT = 300;

/*
    Parse the data to make the graphs
    @Params:
     - data - the data structure the holds all relevant data
     - testIndex - the index to the right section of data for this graph
     - score_name - the score name that should be retrieved
    @Return:
    - columns - the data structure to hold the data needed to create a graph
*/
function parseData(data,  score_name){
  //parse the data into columns
  var columns = [];
  var i = 0;
  while(columns.length < 10 && i < data.length){
     var col = [data[i]['userName'], data[i][score_name], "rgb(200, 20, 60)"];
     columns[i] = col;
     i++;
  }
    
return columns;
}


/*
    The Vision Test
    Create a graph that projects the data of the current user compared to past users.
    @data - The onject that holds all data from the db.
*/
function makeVisionGraph(data){
    //Create the data stuctures to plot
    google.setOnLoadCallback(function() { drawChart(data1); });

    //parse the data into columns
    var columns = parseData(data.vision, 'vscore');

    var data1 = new google.visualization.DataTable();
    data1.addColumn('string', '');
    data1.addColumn('number', '');
    data1.addColumn({ type: 'string', role: 'style' });

    data1.addRows(columns.length);
    var num_of_columns = 3;
    var num_of_users = columns.length;
    var i;
    var j;
    for(i = 0; i < num_of_users; i++){
        for(j = 0; j < num_of_columns; j++){
            data1.setValue(i,j,columns[i][j]);
        }
    }
  function drawChart(data) {
    var chart = new google.visualization.BarChart(document.getElementById('chart_div_vision'));
    chart.draw(data, {
            width: 400,
            height: 175,
            title: 'Eye Test',
            legend: 'none',
            'width':WIDTH,
            'height':HEIGHT
    });
  }
}

/*
    The Dexterity Test
    Create a graph that projects the data of the current user compared to past users.
    @data - The onject that holds all data from the db.
*/
function makeDexterityGraph(data){
    //Create the data stuctures to plot
    google.setOnLoadCallback(function() { drawChart(data1); });
//parse the data into columns
var columns = parseData(data.reflex,'rscore');

    var data1 = new google.visualization.DataTable();
    data1.addColumn('string', '');
    data1.addColumn('number', '');
    data1.addColumn({ type: 'string', role: 'style' });
    data1.addRows(columns.length);
    var num_of_columns = 3;
    var num_of_users = columns.length;
    var i;
    var j;
    for(i = 0; i < num_of_users; i++){
        for(j = 0; j < num_of_columns; j++){
            data1.setValue(i,j,columns[i][j]);
        }
    }
  function drawChart(data) {
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_dexterity'));
    chart.draw(data, {
            width: 400,
            height: 175,
            title: 'Dexterity Test',
            legend: 'none',
            'width':WIDTH,
            'height':HEIGHT
    });
  }
}

/*
The Hearing Test for the left ear
Create a graph that projects the data of the current user compared to past users.
@data - The onject that holds all data from the db.
*/
function makeLeftHearingGraph(data){

   google.setOnLoadCallback(function() { 
//       alert(data.hearing);
       var columns = parseData(data.hearing,'L');

        var data1 = new google.visualization.DataTable();
        data1.addColumn('string', '');
        data1.addColumn('number', '');
        data1.addColumn({ type: 'string', role: 'style' });

        data1.addRows(columns.length);

        var num_of_columns = 3;
        var num_of_users = columns.length;
        var i;
        var j;
        for(i = 0; i < num_of_users; i++){
            for(j = 0; j < num_of_columns; j++){
                data1.setValue(i,j,columns[i][j]);
            }
        }
            
    drawChart(data1); 
   }); 
}

function drawChart(data) {
//alert(document.getElementById('chart_div_hearing_left'));
var chart = new google.visualization.BarChart(document.getElementById('chart_div_hearing_left'));
chart.draw(data, {
        width: 400,
        height: 175,
        title: 'Hearing Test Left Ear',
        legend: 'none',
        'width':WIDTH,
        'height':HEIGHT
});
}


/*
The Hearing Test for the right ear
Create a graph that projects the data of the current user compared to past users.
@data - The onject that holds all data from the db.
*/
function makeRightHearingGraph(data){

//Create the data stuctures to plot
google.setOnLoadCallback(function() { drawChart(data1); });
//parse the data into columns

var columns = parseData(data.hearing, 'R');

var data1 = new google.visualization.DataTable();
data1.addColumn('string', '');
data1.addColumn('number', '');
data1.addColumn({ type: 'string', role: 'style' });

data1.addRows(columns.length);

var num_of_columns = 3;
var num_of_users = columns.length;
var i;
var j;
for(i = 0; i < num_of_users; i++){
    for(j = 0; j < num_of_columns; j++){
        data1.setValue(i,j,columns[i][j]);
    }
}
    function drawChart(data) {
    var chart = new google.visualization.BarChart(document.getElementById('chart_div_hearing_right'));
    chart.draw(data, {
            width: WIDTH,
            height: HEIGHT,
            title: 'Hearing Test Right Ear',
            legend: 'none'
    //        backgroundColor: '#E4E4E4',
    });
    }
}

/*
    Compare user results to the standard results for their age.
    @hearing_result - the result of the hearing test
*/
function getEstimatedAge(hearing_result){
    var standard_hearing =
    {
        18000: 19,
        12500: 29,
        11200: 39,
        10000: 49,
        9000: 59,
        8000: 69,
        5000: 90
    };
    var levels = [18000, 12500, 11200, 10000, 9000, 8000, 5000];
    var i;
    var estimated_age_index = levels.length - 2;

    for(i = 0; i < levels.length - 1; i++){
        if(hearing_result > levels[i]){
             estimated_age_index = i;
             break;
        }
    }
    if(estimated_age_index === 0) return standard_hearing[levels[estimated_age_index]];

    var prev_index = estimated_age_index - 1;
    var age_range = standard_hearing[levels[estimated_age_index]] - standard_hearing[levels[prev_index]];
    var freq_range = levels[prev_index] - levels[estimated_age_index];
    var result_diff = levels[prev_index] - hearing_result;
    var estimated_age = result_diff/freq_range*age_range + standard_hearing[levels[prev_index]];
    estimated_age = parseInt(estimated_age);
    return estimated_age;
}
