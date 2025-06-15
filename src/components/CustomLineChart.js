import { View } from "react-native";
import { LineChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import {
  Circle,
  G,
  Text as SVGText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import * as shape from "d3-shape";

export default function CustomLineChart({ chartData }) {
  const data = chartData?.datasets?.[0]?.data || [];
  const labels = chartData?.labels || [];

  const contentInset = { top: 20, bottom: 20 };
  const horizontalInset = { left: 20, right: 20 };

  const CustomDots = ({ x, y, data }) =>
    data?.map((value, index) => (
      <G key={index}>
        <Circle
          cx={x(index)}
          cy={y(value)}
          r={4}
          fill="#222"
          stroke="#fff"
          strokeWidth={2}
        />
        <SVGText
          x={x(index)}
          y={y(value) - 10}
          fontSize={11}
          fill="#222"
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {value}
        </SVGText>
      </G>
    ));

  return (
    <View style={{ padding: 0 }}>
      <View style={{ flexDirection: "row", height: 220 }}>
        <YAxis
          data={data}
          contentInset={contentInset}
          numberOfTicks={5}
          svg={{
            fill: "#999",
            fontSize: 12,
          }}
        />
        <View style={{ flex: 1, marginLeft: 5 }}>
          <LineChart
            style={{ flex: 1 }}
            data={data}
            curve={shape.curveNatural}
            svg={{
              stroke: "url(#gradient)",
              strokeWidth: 3,
            }}
            contentInset={{ ...contentInset, ...horizontalInset }}
          >
            <Grid svg={{ stroke: "#eee", strokeDasharray: [4, 4] }} />
            <Defs>
              <LinearGradient id="gradient" x1="0" y="0" x2="100%" y2="0">
                <Stop offset="0%" stopColor="#222" stopOpacity={0.8} />
                <Stop offset="100%" stopColor="#222" stopOpacity={0.8} />
              </LinearGradient>
            </Defs>
            <CustomDots />
          </LineChart>
          <XAxis
            style={{ marginTop: 8 }}
            data={data}
            formatLabel={(value, index) => labels[index]}
            contentInset={{ left: 20, right: 20 }}
            svg={{
              fill: "#999",
              fontSize: 12,
              rotation: 0,
              originY: 10,
              y: 5,
              textAnchor: "middle",
            }}
          />
        </View>
      </View>
    </View>
  );
}
