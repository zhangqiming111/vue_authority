export function createGraphOption() {
  const axisData = ["1", "2", "3", "4", "5"];
      const data = axisData.map(function(item, i) {
        return Math.round(Math.random() * 100 * (i + 1));
      });
      const links = data.map(function(item, i) {
        return {
          source: i,
          target: i + 1,
        };
      });
      links.pop();
  return {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: axisData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "graph",
            layout: "none",
            coordinateSystem: "cartesian2d",
            symbolSize: 40,
            label: {
              show: true,
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            data: data,
            links: links,
            lineStyle: {
              color: "#2f4554",
            },
          },
        ],
      };
}
