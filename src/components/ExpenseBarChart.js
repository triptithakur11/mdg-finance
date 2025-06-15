import { useEffect, useState } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-svg-charts";
import { G, Text as SVGText } from "react-native-svg";
import * as scale from "d3-scale";

export default function ExpenseBarChart({ chartData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const groupedData = {};

    chartData?.forEach((item) => {
      const category = item?.category;
      const amount = item?.amount || 0;
      groupedData[category] = (groupedData[category] || 0) + amount;
    });

    const data = Object.entries(groupedData).map(([label, value]) => ({
      label,
      value,
    }));

    setData(data);
  }, [chartData]);

  const Labels = ({ x, y, bandwidth, data }) => (
    <G>
      {data?.map((item, index) => (
        <SVGText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(item.value) - 8}
          fontSize={12}
          fill="#222"
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {"₹" + item.value}
        </SVGText>
      ))}
    </G>
  );

  const XAxisLabels = ({ x, bandwidth, data, height }) => (
    <G>
      {data.map((item, index) => (
        <SVGText
          key={`xaxis-${index}`}
          x={x(index) + bandwidth / 2}
          y={height - 14}
          fontSize={12}
          fill="#222"
          alignmentBaseline="hanging"
          textAnchor="middle"
        >
          {item.label}
        </SVGText>
      ))}
    </G>
  );

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 }}>
      <BarChart
        style={{ height: 220 }}
        data={data}
        yAccessor={({ item }) => item.value}
        svg={{ fill: "#222" }}
        spacingInner={0.3}
        contentInset={{ top: 20, bottom: 30 }}
        gridMin={0}
        numberOfTicks={5}
        xScale={scale.scaleBand}
      >
        <Labels />
        <XAxisLabels height={20} />
      </BarChart>
    </View>
  );
}
