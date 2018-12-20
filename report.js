
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

makeViolinChart();

