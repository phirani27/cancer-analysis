
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


}

function makeScatterChart(){ 
    // from http://bl.ocks.org/mbostock/4349187
    // Sample from a normal distribution with mean 0, stddev 1.

    //x = data from first.. 
    //y = data from second..
    let xCord = $('#scatter1').val();
    let yCord = $('#scatter2').val();
    let x = ANALYSIS_DATA.map((attr)=>attr[xCord]);
    let y = ANALYSIS_DATA.map((attr)=>attr[yCord]);

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
}

function makeSplomChart(){
    
    let text = ANALYSIS_DATA.map((data)=>{
        if(data['diagnosis']==="M")
            return 'Malign';
        else
            return 'Benign';
    });
    let color = ANALYSIS_DATA.map((data)=>{
        if(data['diagnosis']==="M")
            return 1;
        else
            return 0;
    });
    let featureList = $('#splom-select').multipleSelect('getSelects', 'value');

    var pl_colorscale=[
        [0.0, '#119dff'],
        [0.5, '#119dff'],
        [0.5, '#ef553b'],
        [1, '#ef553b']
    ]

    let dimensions = featureList.map((feature)=>{
        return {label: feature, values: ANALYSIS_DATA.map((data)=>data[feature])};
    });

    var axis = {
        showline:false,
        zeroline:false,
        gridcolor:'#ffff',
        ticklen:2,
        tickfont:{size:10},
        titlefont:{size:12}
    };

    var data = [{
        type: 'splom',
        dimensions: dimensions,
        text:text,
        marker: {
            color: color,
            colorscale: pl_colorscale,
            size: 5,
            line: {
                color: 'white',
                width: 0.5
            }
        }
    }];

    var layout = {
        title:"",
        height: 800,
        margin: 0,
        width: $("#splom-chart").width(),
        showlegend: true,
        legend: {
            orientation: "h",
            y: 10
        },
        hovermode:'closest',
        dragmode:'select',
        plot_bgcolor:'rgba(240,240,240, 0.95)',
        xaxis:axis,
        yaxis:axis
    };

    for(var i=0,len=featureList.length;i<len;i++){
        layout['xaxis'+i] = axis;
        layout['yaxis'+i] = axis;
    }

    Plotly.react('splom-chart', data, layout);  
}

function makeHeatMap(){


    let featureList = $('#heatMap-select').multipleSelect('getSelects', 'value');
    let featureObj = {};
    for(let i=0,len=featureList.length;i<len;i++){
        featureObj[featureList[i]] = 1;
    }

    let zObj = {},z=[];
    for(let i=0,len=DATA_HEAT_MAP.length;i<len;i++){
        let row = DATA_HEAT_MAP[i];
        let currVal = row['row'];
        if(featureObj[currVal]){
            let currRow = [];
            for(let i=0,len=featureList.length;i<len;i++){
                currRow.push(row[featureList[i]]);
            }
            zObj[currVal] = currRow;
        }
    }

    for(let i=0,len=featureList.length;i<len;i++){
        z.push(zObj[featureList[i]]);
    }

    z = z.reverse();

    let colorscaleValue = [
        [0, '#5C1E51'],
        [0.25, '#AD1759'],
        [0.5, '#EC4A3E'],
        [0.75, '#F6A178'],
        [1, '#FAEBDD']
    ];

    var data = [
        {
          z: z,
          x: featureList,
          y: featureList.reverse(),
          type: 'heatmap',
          colorscale: colorscaleValue
        }
      ];

      var layout = {
        title: '',
        height: 600,
        width: $("#heatMap-chart").width(),
        annotations: [],
        xaxis: {
          ticks: ''
        },
        yaxis: {
          ticks: '',
          ticksuffix: ' ',
          width: 700,
          height: 700,
          autosize: false
        }
      };

      /** Anotations */
      for ( var i = 0; i < featureList.length; i++ ) {
        for ( var j = 0; j < featureList.length; j++ ) {
            let color = 'white';
            if(z[i][j] > 0.6){
                color = 'black';
            }    
            var result = {
            xref: 'x1',
            yref: 'y1',
            x: featureList[j],
            y: featureList[i],
            text: z[i][j].toFixed(2),
            font: {
                family: 'Arial',
                size: 12,
                color: color
            },
            showarrow: false
            };
            layout.annotations.push(result);
        }
      }
      
      Plotly.newPlot('heatMap-chart', data, layout);
}


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

$(".scatter-dropdown").change(function(){
    Plotly.purge('scatter-chart');
    makeScatterChart();    
});

$('#splom-select').multipleSelect({
    selectAll: true,
    onClick: function(){
        Plotly.purge('splom-chart');
        makeSplomChart();        
    },
    onCheckAll: function(){
        Plotly.purge('splom-chart');
        makeSplomChart();        
    }
});

$('#heatMap-select').multipleSelect({
    selectAll: true,
    onClick: function(){
        Plotly.purge('heatMap-chart');
        makeHeatMap();        
    },
    onCheckAll: function(){
        Plotly.purge('heatMap-chart');
        makeHeatMap();        
    }
});

makeViolinChart();

makeScatterChart();

makeSplomChart();

makeHeatMap();