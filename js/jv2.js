document.addEventListener("DOMContentLoaded", function() {
    fetch("./player.csv")
   .then(response => response.text())
   .then(data => {
        console.log("Respuesta completa:", data);
        console.log("Datos cargados:", data);
        const parsedData = Papa.parse(data, {header: true}).data;

        if(parsedData.length > 0) {
            console.log("Buena carga");
            const years = ['2000', '2004', '2008', '2012', '2016', '2020'];

            // Crear el elemento select y añadir opciones
            const selectElement = document.getElementById('featureOptions');
            const options = parsedData.map(row => row.Athlete);
            options.forEach((value, index) => {
                const optionElement = document.createElement('option');
                optionElement.value = value;
                optionElement.textContent = value;
            });

            // Función para manejar el cambio en el select
            selectElement.addEventListener('change', function() {
                const selectedOptionValue = this.value;
                const athleteName = selectedOptionValue; // El nombre del atleta es el mismo que el valor seleccionado
                // Filtrar los datos basados en el atleta seleccionado
                const filteredData = parsedData.filter(row => row.Athlete === athleteName);
                years.forEach((year) => {
                    if (!filteredData.some(row => row.Anno === year && row.count!== undefined)) {
                        filteredData.push({ Anno: year, count: 0 });
                    }
                });
                const filteredEdad=edades.find(row => row.nombre === athleteName)
                filteredData.sort((a, b) => a.Anno - b.Anno);
                console.log(filteredEdad)
                document.getElementById('edada').textContent = `El atleta ${athleteName} tiene ${filteredEdad.edad} años`; 
                // Actualizar el gráfico de barras con los datos filtrados
                //updateBarChart(filteredData); // Asumiendo que esta es la función para inicializar el gráfico
                updateChartData('myChart', filteredData); // Ahora verifica si el gráfico existe antes de actualizar
            });
            const initialAthleteData = parsedData.filter(row => row.Athlete === "Maykel Massó");
            years.forEach((year) => {
                if (!initialAthleteData.some(row => row.Anno === year && row.count!== undefined)) {
                    initialAthleteData.push({ Anno: year, count: 0 });
                }
            });
            initialAthleteData.sort((a, b) => a.Anno - b.Anno);
            updateChartData('myChart', initialAthleteData); 
        } else {
            console.log("No se cargaron datos");
        }
    })
   .catch(error => console.error('Error al cargar o parsear el CSV:', error));
});

const edades = [
    { nombre: "Asley González", edad: 34,participara:""},
    { nombre: "Idalys Ortiz", edad: 34 },
    { nombre: "Iván Cambar Rodriguez", edad: 40 },
    { nombre: "Leonel Suárez", edad: 36},
    { nombre: "Leuris Pupo", edad: 47 },
    { nombre: "Liván López Azcuy", edad: 42 },    
    { nombre: "Lazaro Alvarez Estrada", edad: 33,participara:""},
    { nombre: "Mijaín López Nuñes", edad: 41 },
    { nombre: "Robelis Despaigne", edad: 35 },
    { nombre: "Roniel Iglesias", edad: 35},
    { nombre: "Yanet Bermoy Acosta", edad: 37 },    
    { nombre: "Yarelis Barrios", edad: 40,participara:""},
    { nombre: "Yarisley Silva", edad: 37 },
    { nombre: "Yasniel Toledo", edad: 34 },
    { nombre: "Arlen López", edad: 31}, 
    { nombre: "Robeisy Ramirez Carrazana", edad: 30},
    { nombre: "Denia Caballero", edad: 34 },
    { nombre: "Yaimé Pérez", edad: 33 },    
    { nombre: "Erislandy Savón", edad: 33,participara:""},
    { nombre: "Reineris Salas Perez", edad: 37 },
    { nombre: "Ismael Borrero", edad: 32 },
    { nombre: "Joahnys Argilagos", edad: 27},
    { nombre: "Julio La Cruz Peraza", edad: 34 },
    { nombre: "Yasmany Daniel Lugo Cabrera", edad: 34 },    
    { nombre: "Andy Cruz", edad: 28,participara:""},
    { nombre: "Juan Miguel Echevarria", edad: 25 },
    { nombre: "Luis Alberto Orta Sanchez", edad: 29 },
    { nombre: "Maykel Masso", edad: 25},
    { nombre: "Rafael Alba Castillo", edad: 30 }
   ];
const gruposPorEdad = edades.reduce((acc, persona) => {
    acc[persona.edad] = (acc[persona.edad] || 0) + 1;
    return acc;
}, {});

// Extraer solo las edades unicas
const edadesUnicas = Object.keys(gruposPorEdad);
const ctx = document.getElementById('edadChart').getContext('2d');
   const chart = new Chart(ctx, {
       type: 'bar',
       data: {
           labels: edadesUnicas,
           datasets: [{
               label: 'Edades',
               data: gruposPorEdad,
               backgroundColor: 'rgba(75, 192, 192, 0.2)',
               borderColor: 'rgba(75, 192, 192, 1)',
               borderWidth: 1
           }]
       },   
       options: {
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    const edad = data.labels[tooltipItem.index];
                    console.log("Edad:", edad); // Verifica la edad obtenida
                    const atletas = edades.filter(persona => persona.edad === parseInt(edad)).map(persona => persona.nombre);
                    console.log("Atletas:", atletas); // Verifica los nombres de los atletas obtenidos
                    return `Edad: ${edad}, Atletas: ${atletas.join(', ')}`;
                }
            }}        
    }
});
// Función para actualizar los datos del gráfico
function updateChartData(chartId, newData) {
    const chart = Chart.getChart(chartId);
    if (chart) {
        chart.data.labels = newData.map(item => item.Anno);
        chart.data.datasets[0].label = newData[0].Athlete;
        chart.data.datasets[0].data = newData.map(item => item.count);
        chart.update();
    } else {
        // Si el gráfico no existe, crea uno nuevo
        const ctx = document.getElementById(chartId).getContext('2d');
        new Chart(ctx, {
            type: 'line', // Asegúrate de que el tipo de gráfico coincida con tus expectativas
            data: {
                labels: newData.map(item => item.Anno),
                datasets: [{
                    label: newData[0].Athlete,
                    data: newData.map(item => item.count),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        stepSize: 1,
                        max: 4,
                        min: 0
                    }
                },
                x: {
                    ticks: {
                        beginAtZero: false,
                        stepSize: 4,
                        max: 1996,
                        min: 2020
                    }
                }
            }
        }
    });
}
}

const data = [
    { year: 1900, medal: 'Gold', count: 1 },
    { year: 1900, medal: 'Silver', count: 1 },
    { year: 1904, medal: 'Gold', count: 4 },
    { year: 1908, count: 0 },
    { year: 1912, count: 0 },
    { year: 1916, count: 0 },
    { year: 1920, count: 0 },
    { year: 1924, count: 0 },
    { year: 1928, count: 0 },
    { year: 1932, count: 0 },
    { year: 1936, count: 0 },
    { year: 1940, count: 0 },
    { year: 1944, count: 0 },
    { year: 1948, medal: 'Silver', count: 2 },
    { year: 1952, count: 0 },
    { year: 1956, count: 0 },
    { year: 1960, count: 0 },
    { year: 1964, medal: 'Silver', count: 1 },
    { year: 1968, medal: 'Silver', count: 4 },
    { year: 1972, medal: 'Bronze', count: 4 },
    { year: 1972, medal: 'Gold', count: 3 },
    { year: 1972, medal: 'Silver', count: 1 },
    { year: 1976, medal: 'Bronze', count: 3 },
    { year: 1976, medal: 'Gold', count: 6 },
    { year: 1976, medal: 'Silver', count: 4 },
    { year: 1980, medal: 'Bronze', count: 5 },
    { year: 1980, medal: 'Gold', count: 8 },
    { year: 1980, medal: 'Silver', count: 7 },
    { year: 1992, medal: 'Bronze', count: 11 },
    { year: 1992, medal: 'Gold', count: 14 },
    { year: 1992, medal: 'Silver', count: 6 },
    { year: 1996, medal: 'Bronze', count: 8 },
    { year: 1996, medal: 'Gold', count: 9 },
    { year: 1996, medal: 'Silver', count: 8 },
    { year: 2000, medal: 'Bronze', count: 7 },
    { year: 2000, medal: 'Gold', count: 11 },
    { year: 2000, medal: 'Silver', count: 11 },
    { year: 2004, medal: 'Bronze', count: 11 },
    { year: 2004, medal: 'Gold', count: 9 },
    { year: 2004, medal: 'Silver', count: 7 },
  {year :2008 ,medal : "Bronze" ,count :17},
  {year :2008 ,medal : "Gold" ,count :3},
  {year :2008 ,medal : "Silver" ,count :10},
  {year :2012 ,medal : "Bronze" ,count :7},
  {year :2012 ,medal : "Gold" ,count :5},
  {year :2012 ,medal : "Silver" ,count :3},
  {year :2016 ,medal : "Bronze" ,count :4},
  {year :2016 ,medal : "Gold" ,count :5},
  {year :2016 ,medal : "Silver" ,count :2},
  {year :2020 ,medal : "Bronze" ,count :5},
  {year :2020 ,medal : "Gold" ,count :7},
  {year :2020 ,medal : "Silver" ,count :3}
  ];
console.log(data)
crearGraficoBarras(data);
console.log("Se ejecuto");
function crearGraficoBarras(data) {
    const labels = [];
    const valoresOro = [];
    const valoresPlata = [];
    const valoresBronce = [];

    // Filtrar las medallas de oro, plata y bronce
    data.forEach(item => {
        if (!labels.includes(item.year)) {
            labels.push(item.year);
        }
        if (item.medal === 'Gold') {
            valoresOro[labels.indexOf(item.year)] = item.count;
        } else if (item.medal === 'Silver') {
            valoresPlata[labels.indexOf(item.year)] = item.count;
        } else if (item.medal === 'Bronze') {
            valoresBronce[labels.indexOf(item.year)] = item.count;
        }
    });
    labels.forEach((year, index) => {
        if (valoresOro[index] === undefined) valoresOro[index] = 0;
        if (valoresPlata[index] === undefined) valoresPlata[index] = 0;
        if (valoresBronce[index] === undefined) valoresBronce[index] = 0;
    });

    // Crear el gráfico de barras agrupadas solo para los años con medallas
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Medallas',
                data: labels.map((_, index) => valoresOro[index] + valoresPlata[index] + valoresBronce[index]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)' // Color de fondo para el gráfico apilado
            },{
                label: 'Oro',
                data: valoresOro,
                backgroundColor: 'gold'
            }, {
                label: 'Plata',
                data: valoresPlata,
                backgroundColor: 'silver'
            }, {
                label: 'Bronce',
                data: valoresBronce,
                backgroundColor: 'peru'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}