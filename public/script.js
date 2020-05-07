var donutchart;
var barclosed;
var baraverage;
var bardays;

function createDonutGraph(data){
    let mappedData = [
        {label:'Ouvertes', value: data.opened},
        {label:'Fermées', value: data.closed},
    ];
    if (donutchart) {
        donutchart.setData(mappedData);
    }
    else {
        donutchart = new Morris.Donut({
            element: 'donut-chart',
            data:mappedData,
            colors: ['#ff0000','0000ff']
        })
    }    
}

function createDiagrammePersonPerIssue(data){
    let mappedData = [];
    for (let prop in data) {
        mappedData.push({x: `${prop}`, a: parseInt(data[prop])});
    }
    if (barclosed) {
        barclosed.setData(mappedData);
    }
    else {
        barclosed = new Morris.Bar({
            element: 'bar-closed',
            data: mappedData,
            xkey: 'x',
            ykeys: ['a'],
            labels: ['Issues fermées']
        })
    }  
}

function createAvgBar(data){
    let mappedData = [
        {x: 'Temps moyen', a: parseInt(data)}
    ];

    if (baraverage) {
        baraverage.setData(mappedData);
    }
    else {
        baraverage = new Morris.Bar({
            element: 'bar-average',
            data: mappedData,
            xkey:'x',
            ykeys:['a'],
            labels:['Nb de jours']
        })
    }  
}

function createOpenPerDayBar(data){
    var dates = data.map((item) => item.created_at.substr(0, 10));
    var distinctDates = [...new Set(dates)]
    let counts = {};

    distinctDates.forEach((date) => 
        counts[date] = dates.filter((d) => d == date).length
    );
    let trueData = distinctDates.map((date) => {
        return { x: date, y: counts[date] };
    });

    if (bardays) {
        bardays.setData(trueData);
    }
    else {
        bardays = new Morris.Bar({
            element: 'bar-days',
            data: trueData,
            xkey:'x',
            ykeys:['y'],
            labels:['Nb d\'issues']
        })
    }  
}
    