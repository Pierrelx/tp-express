$(document).ready(function() {
    var socket = io.connect();
    M.toast({html: 'Socket connecté', classes: 'info'})

    socket.on('gitlab_trigger', (data) => {
        console.log('Socket triggered: calling loadGraphs', data.date);
        loadGraphs();
        M.toast({html: 'Graphs actualisés', classes: 'info'})
    })
});
  