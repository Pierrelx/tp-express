
function createDonutGraph(data){
    $('#donut-chart').empty();
    new Morris.Donut({
        element: 'donut-chart',
        data:[
            {label:'Ouvertes', value: data.opened},
            {label:'Fermées', value: data.closed},
        ],
        colors: ['#ff0000','0000ff']
    })
}

function createDiagrammePersonPerIssue(data){
    $('#bar-closed').empty();

    new Morris.Bar({
        element: 'bar-closed',
        data:[
            {x: "Bryce.m", a: parseInt(data["Bryce.m"])},
            {x: "romzinator", a: parseInt(data["romzinator"])}
        ],
        xkey: 'x',
        ykeys: ['a'],
        labels: ['Issues fermées']
    })
}

function createAvgBar(data){
    $('#bar-average').empty();
    new Morris.Bar({
        element: 'bar-average',
        data:[
            {x: 'Temps moyen', a: parseInt(data)}
        ],
        xkey:'x',
        ykeys:['a'],
        labels:['Nb de jours']
    })
}

function createOpenPerDayBar(data){
    var dates = []
    var trueData = []
    for(var i = 0; i < data.length; i++){
        dates.push(data[i].created_at.substr(0, 10))
    }
    var distinctDates = [...new Set(dates)]
    var counts = {};
    dates.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    for(var i = 0; i < distinctDates.length; i++){
        trueData.push({x: distinctDates[i], y: counts[distinctDates[i]]});
    }

    $('#bar-days').empty();

    new Morris.Bar({
        element: 'bar-days',
        data: trueData,
        xkey:'x',
        ykeys:['y'],
        labels:['Nb d\'issues']
    })
}
    