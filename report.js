
function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
}

function makeViolinChart(){
    let featureList = [
        'radius_mean',
        'texture_mean',
        'perimeter_mean',
        'area_mean',
        'smoothness_mean',
        'compactness_mean',
        'concavity_mean',
        'concave points_mean',
        'symmetry_mean',
        'fractal_dimension_mean',
        'texture_worst',
        'perimeter_worst',
        'area_worst',
        'smoothness_worst',
        'compactness_worst',
        'concavity_worst',
        'concave points_worst',
        'symmetry_worst',
        'fractal_dimension_worst'
    ];	
    
    featureList = $('#violin-select').multipleSelect('getSelects', 'value');
    var getData = function(featureList,diagnosis){
        return DATA_VIOLIN.filter((data)=>{
            if(featureList && diagnosis){
                return (data.diagnosis === diagnosis) && (featureList.indexOf(data.features)  > -1);
            }else if(featureList){
                return (featureList.indexOf(data.features)  > -1);
            }else if(diagnosis){
                return (data.diagnosis === diagnosis);
            }
        });
    };
    
    var data_features = getData(featureList);
    var M_data = getData(null,'M');
    var B_data = getData(null,'B');

    var data = [
        {
            type: 'violin',
            x: unpack(data_features, 'features'),
            y: unpack(B_data, 'value'),
            legendgroup: 'B',
            scalegroup: 'B',
            points: 'none',
            name: 'Benign',
            box: {
                visible: true
            },
            boxpoints: false,
            line: {
                color: 'blue'
            },
            fillcolor: '#8dd3c7',
            opacity: 0.6,
            meanline: {
                visible: true
            }
        },
        {
            type: 'violin',
            x: unpack(data_features, 'features'),
            y: unpack(M_data, 'value'),
            legendgroup: 'M',
            scalegroup: 'M',
            points: 'none',
            name: 'Malign',
            box: {
                visible: true
            },
            boxpoints: false,
            line: {
                color: 'green'
            },
            fillcolor: '#ffffff',
            opacity: 0.6,
            meanline: {
                visible: true
            },
            x0: "radius_mean"
        }
    ];
  
    var layout = {
        title: "Violin Plot",
        yaxis: {
        zeroline: false
        },
        violinmode: 'group',
        height: 600,
        margin: {
          l: 50,
          r: 0,
          t: 0,
          pad: 0,
          bottom: 10
        },
        legend: {
            orientation: "h",
            y: 10
        }
    }
    Plotly.plot('violin-chart', data, layout);    


};

function makeScatterChart(){
    // from http://bl.ocks.org/mbostock/4349187
    // Sample from a normal distribution with mean 0, stddev 1.

    function normal() {
        var x = 0,
            y = 0,
            rds, c;
        do {
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            rds = x * x + y * y;
        } while (rds == 0 || rds > 1);
        c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
        return x * c; // throw away extra sample y * c
    }

    var N = 2000,
    a = -1,
    b = 1.2;

    var step = (b - a) / (N - 1);
    var t = new Array(N), x = new Array(N), y = new Array(N);

    for(var i = 0; i < N; i++){
        t[i] = a + step * i;
        x[i] = (Math.pow(t[i], 3)) + (0.3 * normal() );
        y[i] = (Math.pow(t[i], 6)) + (3 * normal() );
    }

    console.log(t);
    console.log(x);
    console.log(y);

    var trace1 = {
        x: x,
        y: y,
        mode: 'markers',
        name: 'points',
        marker: {
            color: 'rgb(102,0,0)',
            size: 2,
            opacity: 0.4
        },
        type: 'scatter'
    };
    var trace2 = {
        x: x,
        y: y,
        name: 'density',
        ncontours: 20,
        colorscale: 'Hot',
        reversescale: true,
        showscale: false,
        type: 'histogram2dcontour'
    };
    var trace3 = {
        x: x,
        name: 'x density',
        marker: {color: 'rgb(102,0,0)'},
        yaxis: 'y2',
        type: 'histogram'
    };
    var trace4 = {
        y: y,
        name: 'y density',
        marker: {color: 'rgb(102,0,0)'},
        xaxis: 'x2',
        type: 'histogram'
    };
    var data = [trace1, trace2, trace3, trace4];
    var layout = {
        showlegend: false,
        height: 600,
        margin: 0,
        hovermode: 'closest',
        bargap: 0,
        xaxis: {
            domain: [0, 0.85],
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            domain: [0, 0.85],
            showgrid: false,
            zeroline: false
        },
        xaxis2: {
            domain: [0.85, 1],
            showgrid: false,
            zeroline: false
        },
        yaxis2: {
            domain: [0.85, 1],
            showgrid: false,
            zeroline: false
        }
    };
    Plotly.newPlot('scatter-chart', data, layout);
};

//select initialization
$('#violin-select').multipleSelect({
    selectAll: true,
    onClick: function(){
        Plotly.purge('violin-chart');
        makeViolinChart();        
    },
    onCheckAll: function(){
        Plotly.purge('violin-chart');
        makeViolinChart();        
    }
});

$("#scatter-dropdown").change(function(){
    Plotly.purge('scatter-chart');
    makeScatterChart();    
}); 

makeViolinChart();

makeScatterChart();
