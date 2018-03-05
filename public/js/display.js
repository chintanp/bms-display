
/*global CanvasJS io */
window.onload = function () {

    var voltageCtx = document.getElementById("voltageChart").getContext("2d");
    var currentCtx = document.getElementById("currentChart").getContext("2d");
    /* keep history of old charts for comparison? */
var voltageChart = [];
var currentChart = [];
var chartdata = [];
var MAX_POINTS_ON_CHART = 50;

var voltageChart = new Chart(voltageCtx, {
		type: 'line',
		data: {
			datasets: [{
                label: "Predicted Voltage",
				data: [],
				strokeColor: "rgba(151,187,205,1)",
				borderColor: "rgba(151,187,205,0.8)"
			}, 
            {
                label: "Measured Voltage",
				data: [],
				strokeColor: "rgba(255,99,132,1)",
				borderColor: "rgba(255,99,132,0.8)"
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'time',
                    time: {
                        unit: 'second', 
                        displayFormats: {
                            second: 'YY:MM:DD:h:mm:ss'
                        }
                    },
                    distribution: 'series',
                    bounds: 'data',
                   
                    ticks: {
                        source: 'auto'
                    },
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
						labelString : "Voltage (mV)"
					},
					gridLines: {
						display:false
					}, 
                    stacked: false
				}]
			},
			title: {
				display: true,
				text: "Real-time Measured and Predicted Voltage"
			},
            responsive: true,
            maintainAspectRatio: false, 
            animation: {
                duration: 100, // general animation time
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            }
		}
	});

    var currentChart = new Chart(currentCtx, {
		type: 'line',
		data: {
			datasets: [{
                label: "Current",
				data: [],
				strokeColor: "rgba(151,187,205,1)",
				borderColor: "rgba(151,187,205,0.8)"
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'time',
                    time: {
                        unit: 'second', 
                        displayFormats: {
                            second: 'YY:MM:DD:h:mm:ss'
                        }
                    },
                    distribution: 'series',
                    bounds: 'data',
                   
                    ticks: {
                        source: 'auto'
                    },
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
						labelString : "Current (mA)"
					},
					gridLines: {
						display:false
					}
				}]
			},
			title: {
				display: true,
				text: "Real-time Current"
			},
            responsive: true,
            maintainAspectRatio: false, 
            animation: {
                duration: 0, // general animation time
            },
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            }
		}
	});


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

    var socket = io(url, options);
    
    function getDateTime() {
        var time = new Date().getTime();
        // 32400000 is (GMT+9 Japan)
        // for your timezone just multiply +/-GMT by 36000000
        var datestr = new Date(time + 19800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
        var dateTime = time; //+ 19800000;
        //var datetime = new Date().today() + " @ " + new Date().timeNow();
        return dateTime;
    }

//     function getDateTime() {

//     var date = new Date();

//     var hour = date.getHours();
//     hour = (hour < 10 ? "0" : "") + hour;

//     var min  = date.getMinutes();
//     min = (min < 10 ? "0" : "") + min;

//     var sec  = date.getSeconds();
//     sec = (sec < 10 ? "0" : "") + sec;

//     var year = date.getFullYear();

//     var month = date.getMonth() + 1;
//     month = (month < 10 ? "0" : "") + month;

//     var day  = date.getDate();
//     day = (day < 10 ? "0" : "") + day;

//     return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
// }

    function addData(charts, data) {
        charts[0].data.datasets[0].data.push(data[0]);
        charts[0].data.datasets[1].data.push(data[1]);
        charts[0].data.datasets[0].label = "Predicted Voltage: " + parseFloat(parseFloat(data[0].y).toFixed(2) - parseFloat(data[1].y).toFixed(2)).toFixed(2) + " mV";
        charts[1].data.datasets[0].data.push(data[2]);
        if(charts[0].chart.data.datasets[0].data.length >= MAX_POINTS_ON_CHART) {
            charts[0].data.datasets[0].data.shift();
            charts[0].data.datasets[1].data.shift();
            charts[1].data.datasets[0].data.shift();
        }
        charts[0].update();
        charts[1].update();
    }

    socket.on('connect', function () {
        console.log("Connection detected on client");
    });

    socket.on('sensor:data', function (data) {
        //console.log("Some data recevied" + JSON.stringify(data));
        var timenow = getDateTime();
        var newdata = [{ t: timenow, y: data.data.predictedVoltage }, 
                        { t: timenow, y: data.data.measuredVoltage }, 
                        { t: timenow, y: data.data.current }];
        console.log("Chartdata:" + JSON.stringify(newdata));
		document.getElementById("p_exectime").innerHTML = parseFloat(data.data.exectime).toFixed(2)
        addData([voltageChart, currentChart], newdata);
          

    });

    console.log("This is it")
    //var socket = io.connect('http://10.95.145.56:5002');
};