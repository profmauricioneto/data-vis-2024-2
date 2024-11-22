d3.csv(
  "https://gist.githubusercontent.com/emanueles/d8df8d875edda71aa2e2365fae2ce225/raw/1e949d3da02ed6caa21fe3a7a12a4e5a611a4bab/stocks.csv"
).then(function (data) {
  // formatando nossos dados
  let parseDate = d3.timeParse("%Y/%m/%d");
  data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.google = +d.google;
    d.facebook = +d.facebook;
  });

  // Criando uma instância de crossfilter
  let ndx = crossfilter(data);

  // Definindo as dimensões e grupos
  let dateDimension = ndx.dimension((d) => d.date);
  let googleDimesion = ndx.dimension((d) => d.google);
  // let topTenGoogle = googleDimesion.top(10);
  // let bottomTenGoogle = googleDimesion.bottom(10);
  let googleByDayGroup = dateDimension.group().reduceSum((d) => d.google);

  let facebookByDayGroup = dateDimension.group().reduceSum((d) => d.facebook);

  let lineChart = dc.lineChart(document.querySelector("#chart"));
  let xScale = d3
    .scaleTime()
    .domain([dateDimension.bottom(1)[0].date, dateDimension.top(1)[0].date]);

  lineChart
    .width(800)
    .height(400)
    .dimension(dateDimension)

    .margins({ top: 30, right: 50, bottom: 25, left: 40 })
    .renderArea(false)
    .x(xScale)
    .xUnits(d3.timeDays)
    .renderHorizontalGridLines(true)
    .legend(dc.legend().x(680).y(10).itemHeight(13).gap(5))
    .brushOn(false)
    .group(googleByDayGroup, "Google");

  let compositeChart = dc.compositeChart(document.querySelector("#chart2"));

  compositeChart
    .width(800)
    .height(400)
    .margins({ top: 50, right: 50, bottom: 25, left: 40 })
    .dimension(dateDimension)
    .x(xScale)
    .xUnits(d3.timeDays)
    .renderHorizontalGridLines(true)
    .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5))
    .brushOn(false)
    .compose([
      dc
        .lineChart(compositeChart)
        .group(googleByDayGroup, "Google")
        .ordinalColors(["steelblue"]),
      dc
        .lineChart(compositeChart)
        .group(facebookByDayGroup, "Facebook")
        .ordinalColors(["darkorange"]),
    ]);

  dc.renderAll();
});
