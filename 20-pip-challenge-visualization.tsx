import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TwentyPipChallenge = () => {
  // Initial parameters
  const startingBalance = 20;
  const riskPercentage = 0.23; // 23% of balance
  const rewardRiskRatio = 1.3; // Reward:Risk = 1:1.3
  const targetBalance = 50000;
  const maxLevels = 30;

  // Calculate growth on a winning trade
  const calculateWin = (balance) => {
    const amountRisked = balance * riskPercentage;
    const profit = amountRisked * rewardRiskRatio;
    return balance + profit;
  };

  // Calculate loss on a losing trade
  const calculateLoss = (balance) => {
    const amountRisked = balance * riskPercentage;
    return balance - amountRisked;
  };

  // Generate all winning trades scenario
  const generateChartData = () => {
    let balance = startingBalance;
    const results = [];
    
    for (let level = 1; level <= maxLevels; level++) {
      const startBalance = balance;
      const amountRisked = startBalance * riskPercentage;
      balance = calculateWin(startBalance);
      const profit = balance - startBalance;
      
      results.push({
        level,
        startBalance: parseFloat(startBalance.toFixed(2)),
        amountRisked: parseFloat(amountRisked.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        endBalance: parseFloat(balance.toFixed(2)),
        percentageGrowth: parseFloat(((balance / startBalance - 1) * 100).toFixed(2))
      });
      
      if (balance >= targetBalance) {
        break; // Target reached
      }
    }
    
    return results;
  };

  const chartData = generateChartData();
  const winsNeeded = chartData.length;

  // Generate table data with formatted values
  const tableData = chartData.map(row => ({
    ...row,
    startBalance: `${row.startBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    riskPercentage: `${(riskPercentage * 100).toFixed(1)}%`,
    amountRisked: `${row.amountRisked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    profit: `${row.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    endBalance: `${row.endBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    percentageGrowth: `${row.percentageGrowth}%`
  }));

  // Calculate the final winning percentage
  const finalPercentage = chartData.length > 0 
    ? ((chartData[chartData.length - 1].endBalance / startingBalance - 1) * 100).toFixed(2) 
    : 0;

  return (
    <div className="flex flex-col space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">20 Pip Challenge - Account Growth Chart</h2>
          <div className="text-sm mb-4">
            <p><strong>Starting Balance:</strong> ${startingBalance}</p>
            <p><strong>Risk per Trade:</strong> {riskPercentage * 100}% of current balance</p>
            <p><strong>Reward:Risk Ratio:</strong> 1:{rewardRiskRatio}</p>
            <p><strong>Target:</strong> ${targetBalance.toLocaleString()}</p>
            <p><strong>Consecutive Wins Needed:</strong> {winsNeeded}</p>
            <p><strong>Total Growth:</strong> {finalPercentage}%</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" label={{ value: 'Trade Number', position: 'insideBottom', offset: -5 }} />
            <YAxis 
              label={{ value: 'Account Balance ($)', angle: -90, position: 'insideLeft' }}
              scale="log"
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Balance']}
              labelFormatter={(value) => `Trade #${value}`}
            />
            <Legend />
            <Line type="monotone" dataKey="endBalance" name="Account Balance" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">20 Pip Challenge - Detailed Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Trade #</th>
                <th className="p-2 border">Starting Balance</th>
                <th className="p-2 border">Risk %</th>
                <th className="p-2 border">Amount Risked</th>
                <th className="p-2 border">Profit</th>
                <th className="p-2 border">Ending Balance</th>
                <th className="p-2 border">Growth %</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-2 border text-center">{row.level}</td>
                  <td className="p-2 border text-right">{row.startBalance}</td>
                  <td className="p-2 border text-center">{row.riskPercentage}</td>
                  <td className="p-2 border text-right">{row.amountRisked}</td>
                  <td className="p-2 border text-right text-green-600">{row.profit}</td>
                  <td className="p-2 border text-right">{row.endBalance}</td>
                  <td className="p-2 border text-right">{row.percentageGrowth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TwentyPipChallenge;
