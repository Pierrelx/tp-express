const axios = require('axios');
const chalk = require('chalk');

class GitLabApi {

    constructor(settings){  
        this.api_key = settings.api_key
        this.project_id = settings.project_id
        this.url = settings.project_url
        this.cache = {};
    }

    /**
     * Vérifie que les dates sont au bon format
     */
    isValidDateRange = function(d1, d2){
        let validDateFormat = /\d{4}[-\/]\d{2}[-\/]\d{2}/;
        if(typeof d1 == 'undefined' && d1 !== null){
            console.log(chalk`{italic minDate} {bold.red n'est pas défini}`);
            return false;
        }
        if(typeof d2 == 'undefined' && d2 !== null){
            console.log(chalk`{italic maxDate} {bold.red n'est pas défini}`);
            return false
        }
        let isMinDateValid = validDateFormat.test(d1);
        let isMaxDateValid = validDateFormat.test(d2);
        if (!isMinDateValid) {
            console.log(chalk`{bold.red Erreur de syntaxe trouvée pour le paramètre} {italic minDate}`);
        }
        if(!isMaxDateValid){
            console.log(chalk`{bold.red Erreur de syntaxe trouvée pour le paramètre} {italic maxDate}`);
        }
        return isMinDateValid && isMaxDateValid;
    }

    /**
     * Effectue la requête GET - récupère le résultat depuis le cache si possible
     */
    get = function(url) {
        return new Promise((successCallback, failureCallback) => {
            if (this.cache[url] != null) {
                try {
                    let data = this.cache[url];
                    console.log(chalk`{green.bold Fetch from cache} {yellow.italic {bold GET - ${url}}}`)
                    successCallback(data); 
                }
                catch(e) {
                    console.log(chalk`{red {bold ERR} fetch from cache {italic GET - ${url}}}`);
                    failureCallback(e);
                }
            }
            else {
                axios.get(url)
                    .then(data => {
                        this.cache[url] = data;
                        console.log(chalk`{greenBright.bold Cached} {yellow GET - ${url}}`)
                        successCallback(data);
                    })
                    .catch(err => failureCallback(err))
            }
        });
    }

    listRecentIssues = function() {
        return new Promise((resolve, reject) => {
            let url = this.url + '/projects/' + this.project_id + '/issues'
    
            var issues = [];
            
            this.get(url)
            .then(
                data => {
                    if(data.data)
                    {
                        for(var i = 0; i < data.data.length; i++){
                            issues.push(data.data[i]);
                        }
                    }
                    resolve(issues);
                }
            )
            .catch(err => {
                console.log(chalk.red(err));
                reject();
            })
            // resolve(issues)
        })
        
    }
    
    issuesStats = function(dateFilter) {
        return new Promise((resolve, reject) => {
            let issuesStats = this.url + '/projects/' + this.project_id + '/issues_statistics?created_after='+dateFilter
            this.get(issuesStats)
            .then(
                data => {
                    let opened = data.data.statistics.counts.opened;
                let closed = data.data.statistics.counts.closed;
                //console.log(chalk`\tissuesStats--> {yellow ${opened} opened} / {green ${closed} closed}`)
                    resolve({opened: opened, closed: closed})
                }
            )
            .catch(err => {
                console.log(chalk.red(err));
                reject()
            })
        })
    }
    
    listClosedIssues = function(datetime) {
        return new Promise((resolve, reject) => {
            let names = []
            let url = this.url + '/projects/' + this.project_id + '/issues?state=closed&created_after='+datetime
            this.get(url)
                .then(response => {
                    for(var i = 0; i < response.data.length; i++){
                        if(response.data[i].closed_by !== null && response.data[i].state ==='closed'){
                            names.push(response.data[i].closed_by.username)              
                        }
                    }
                    var result = {}
                    names.forEach(function(x){ result[x] = (result[x] || 0) +1; });
                    resolve(result)
                })
                .catch(error => {
                    console.log(chalk.red(error))
                    this.errored = true
                    reject();
                })
        })
    }
    
    listOpenedIssues = function(datetime) {
        //Retourne la liste des issues en état opened. 
        //Ajouter une plage de date en paramètre pour filtrer sur la date de création des issues.
        let url = this.url + '/projects/' + this.project_id + '/issues?state=opened&created_after='+datetime
        this.get(url)
            .then(response => {
                console.log(response)              
            })
            .catch(error => {
                console.log(chalk.red(error))
                this.errored = true
            })
 
       // console.log("listOpenedIssues");
    }
    
    averageOpenTime = function(dateDebut,dateFin) {
        // if(!this.isValidDateRange(dateDebut, dateFin)) {
        //     return;
        // }
        return new Promise((resolve, reject) => {
            //Prend en paramètre une date de début et une date de fin. 
            let url = this.url + '/projects/' + this.project_id + '/issues?created_after='+dateDebut+'&created_before='+dateFin
                
            this.get(url)
            .then(
                data => {                
                    let validIssues = data.data.filter((item) => {
                        if(!item.closed_at || !item.created_at) {
                            //console.log(chalk`Skipped issue n°${item.iid} (created_at = {yellow ${item.created_at}}, closed_at = {yellow ${item.closed_at})}`)
                            return false;
                        }
                        return true
                    });
                    let average = validIssues
                        .reduce((acc, item) => {                        
                            let closed_at = new Date(item.closed_at);
                            let created_at = new Date(item.created_at);
                            let diff = closed_at.getTime() - created_at.getTime()
                            let diffInDays = diff / (1000 * 3600 * 24);  //1d = 24h * 3600s * 1000ms
                            //console.log(chalk`Issue n°{greenBright ${item.iid}} closed in {greenBright ${diffInDays.toFixed(2)} days} (${diff.toFixed()} ms) {green ${item.created_at}} -> {green ${item.closed_at}}`)
                            return acc + diffInDays;
                        }, 0) / validIssues.length;

                    // console.log(chalk`Avg: {red.bold ${average.toFixed(2)}d}/issue`);
                    resolve(average.toFixed(2));
                }
            )
            .catch(err => {
                console.log(chalk.red(err));
                reject();
            })
        })
    }
}

module.exports = GitLabApi