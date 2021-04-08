const HardwareType = {
    Mainboard: 0,
    SuperIO: 1,
    CPU: 2,
    RAM: 3,
    GpuNvidia: 4,
    GpuAti: 5,
    TBalancer: 6,
    HeatMaster: 7,
    HDD: 8
};

const SensorType = {
    Voltage: 0, // V
    Clock: 1, // MHz
    Temperature: 2, // °C
    Load: 3, // %
    Fan: 4, // RPM
    Flow: 5, // L/h
    Control: 6, // %
    Level: 7, // %
    Factor: 8, // 1
    Power: 9, // W
    Data: 10, // GB = 2^30 Bytes
};

const HardwareTypeArray = Object.keys(HardwareType);
const SensorTypeArray = Object.keys(SensorType);


async function req() {
    let requisicao = await fetch(
        'http://localhost:8080'
    );
    dados = await requisicao.json();
    exibirInfo(dados);
}
req();

setInterval(req, 1000);


function exibirInfo(data) {
    data.map(item => {
        if (item.HardwareType == 0) {
            $('#mainBoard').text(`${HardwareTypeArray[item.HardwareType]} [${item.Name}]`)
        }
        if (item.HardwareType == 2) {
            $('#CPUname').text(item.Name);
            $('#CPUtemp').html(`<b>Temperatura</b><br>`);
            item.Sensors.map(i => {
                if (i.Name == "CPU Total") {
                    chartCPU.updateSeries([ajusteCasas(i.Value,0)])
                }
                if (i.SensorType == 2) {
                    $('#CPUtemp').append(` -${i.Name}: ${i.Value}ºC<br>`)
                }
            });
        }
        if (item.HardwareType == 4) {
            
            $('#GPUtemp').html('<b>Temperatura</b><br>');
            $('#GPUname').text(item.Name);
            item.Sensors.map(i => {
                if (i.SensorType == 2) {
                    $('#GPUtemp').append(` -${i.Name}: ${i.Value}ºC<br>`);
                }
                if (i.SensorType == 3) {
                    if (i.Name == "GPU Core") {
                        chartGPU.updateSeries([ajusteCasas(i.Value,0)])
                    }
                }
            });
        }
        if (item.HardwareType == 3) {
            console.log(item);
            $('#RAMname').text(item.Name);
            item.Sensors.map(i =>{
                if(i.SensorType == 3){
                    chartRAM.updateSeries([ajusteCasas(i.Value,0)])
                }
                
            })
        }

    });
}

var options2 = {

    chart: {
        height: 280,
        type: "radialBar",
    },
    series: [0],
    colors: ["#20E647"],
    plotOptions: {
        radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
                background: '#333',
                startAngle: -90,
                endAngle: 90,
            },
            dataLabels: {
                name: {
                    show: false,
                },
                value: {
                    fontSize: "30px",
                    show: true
                }
            }
        }
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: "dark",
            type: "horizontal",
            gradientToColors: ["#87D4F9"],
            stops: [0, 100]
        }
    },
    stroke: {
        lineCap: "butt"
    },
    labels: ["Progress"]
};

let chartCPU = new ApexCharts(document.querySelector("#CPUuse"), options2);
let chartGPU = new ApexCharts(document.querySelector("#GPUuse"), options2);
let chartRAM = new ApexCharts(document.querySelector("#RAMuse"), options2);
chartCPU.render();
chartGPU.render();
chartRAM.render();




function ajusteCasas(nr, casas) {
    const og = Math.pow(10, casas)
    return Math.floor(nr * og) / og;
  }