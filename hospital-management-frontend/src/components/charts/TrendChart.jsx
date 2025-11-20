import { Area, AreaChart, Tooltip, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const TrendChart = ({ data }) => (
  <div className="card">
    <h2>Weekly Appointments</h2>
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="var(--primary)" fill="url(#colorPrimary)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TrendChart;

