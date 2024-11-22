d3.json("data/movies.json")
  .then(function (data) {
    try {
      var ndx = crossfilter(data);

      // Dimensão e grupo por ano
      var yearDimension = ndx.dimension(function (d) {
        return d.Year;
      });
      var yearGroup = yearDimension.group().reduceSum(function (d) {
        return d.Worldwide_Gross_M;
      });

      // Gráfico de barras por ano
      var by_year = dc.barChart("#chart-by-year");
      by_year
        .width(800)
        .height(400)
        .gap(30)
        .margins({ top: 30, right: 50, bottom: 25, left: 40 })
        .dimension(data)
        .group(yearGroup)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .controlsUseVisibility(true)
        .brushOn(true)
        .render();

      // Dimensão e grupo por ano
      var genreDimension = ndx.dimension(function (d) {
        return d.Genre;
      });
      var genreGroup = genreDimension.group().reduceSum(function (d) {
        return d.Worldwide_Gross_M;
      });

      // Gráfico de barras por ano
      var by_genre = dc.barChart("#chart-by-genre");
      by_genre
        .width(800)
        .height(400)
        .gap(30)
        .margins({ top: 30, right: 50, bottom: 25, left: 40 })
        .dimension(data)
        .group(genreGroup)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .controlsUseVisibility(true)
        .brushOn(true)
        .render();
    } catch (error) {
      console.error("Erro ao processar os dados: ", error);
    }
  })
  .catch(function (error) {
    console.error("Erro ao carregar o arquivo JSON: ", error);
  });
