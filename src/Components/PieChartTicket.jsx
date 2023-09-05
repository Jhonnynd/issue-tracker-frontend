import React, { useRef, useEffect } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

const PieChartTicket = ({ ticketData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: ticketData,
        },
      ],
    };

    chartInstance.setOption(option);

    window.addEventListener("resize", chartInstance.resize);

    return () => {
      chartInstance.dispose();
      window.removeEventListener("resize", chartInstance.resize);
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
};

export default PieChartTicket;
