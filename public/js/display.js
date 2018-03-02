
/*global CanvasJS io */
window.onload = function () {

    var ctx = document.getElementById("myChart").getContext("2d");
    /* keep history of old charts for comparison? */
var charts = [];
var chartdata = [];

function timeChart(id, data, title, ylabel) {

    // clear chart if it already exists
    // otherwise hover events will not work
    var old = charts.filter(function( obj ) {
        return obj.id == id;
    });

    if (old.length > 0) {
        old.forEach(function(c) {
            c.chart.destroy();
        })
    }

    // create new chart
	var ctx = document.getElementById(id);
	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				data: data,
				strokeColor: "rgba(151,187,205,1)",
				borderColor: "rgba(151,187,205,0.8)"
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom',
					scaleLabel :{
						display :true,
						labelString : "Time (sec)"
					},
					gridLines: {
						display:false
					}
				}],
				yAxes: [{
					scaleLabel :{
						display :true,
						labelString : ylabel
					},
					gridLines: {
						display:false
					}
				}]
			},
			title: {
				display: true,
				text: title
			},
            responsive: true,
            maintainAspectRatio: false
		}
	});
    charts.push({
        id: id,
        chart: chart
    });
}


    var port = window.location.port,
        host = window.location.hostname,
        protocol = window.location.protocol,
        path = '/',
        url,
        options = {};

    if (protocol.indexOf('https') > -1) {
        protocol = 'wss:';
    } else {
        protocol = 'ws:'
    }

    url = protocol + "//" + host + ":" + port + path;

    options = {};

    /*
    // If you wanted to add an access token, "Session" is where I store this
    if( Session.token ) {
       options.query = 'access_token=' + Session.token;
    }
    */

    var options = {
        animation: false,
        //Boolean - If we want to override with a hard coded scale
        scaleOverride: true,
        //** Required if scaleOverride is true **
        //Number - The number of steps in a hard coded scale
        scaleSteps: 10,
        //Number - The value jump in the hard coded scale
        scaleStepWidth: 10,
        //Number - The scale starting value
        scaleStartValue: 0
    };
    var socket = io(url, options);
    

    function getDateTime() {
        var time = new Date().getTime();
        // 32400000 is (GMT+9 Japan)
        // for your timezone just multiply +/-GMT by 36000000
        //var datestr = new Date(time + 19800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
        var dateTime = time; //+ 19800000;
        return dateTime;
    }

    function addData(chart, data) {
        chart.data.datasets.push(data);
        chart.update();
    }

    socket.on('connect', function () {
        console.log("Connection detected on client");
    });

    socket.on('sensor:data', function (data) {
        //console.log("Some data recevied" + JSON.stringify(data));

        chartdata.push({ x: getDateTime(), y: data.data.objectTemp });
        console.log("Chartdata:" + JSON.stringify(chartdata));
        timeChart('myChart', chartdata, 'Voltage', 'Voltage (V)');


    });

    console.log("This is it")
    //var socket = io.connect('http://10.95.145.56:5002');
};