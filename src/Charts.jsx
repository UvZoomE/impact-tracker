import React from "react";
import Chart from "react-google-charts";

function Charts() {
  // Come back to filling out chart when Create WAR info is done

  const data = [
    ["WAR #1", "Average"],
    ["2004/05", 165, 938, 522, 998, 450, 614.6],
    ["2005/06", 135, 1120, 599, 1268, 288, 682],
    ["2006/07", 157, 1167, 587, 807, 397, 623],
    ["2007/08", 139, 1110, 615, 968, 215, 609.4],
    ["2008/09", 136, 691, 629, 1026, 366, 569.6],
  ];

  return (
    <Chart
      chartType="ComboChart"
      width="100%"
      height="100%"
      data={data}
    />
  );
}

export default Charts;
