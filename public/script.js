function createDonutGraph(data){
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
    