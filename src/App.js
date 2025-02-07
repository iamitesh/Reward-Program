import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const fetchTransactions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, customer: "John Doe", amount: 120, date: "2024-01-15" },
        { id: 2, customer: "John Doe", amount: 75, date: "2024-01-20" },
        { id: 3, customer: "Jane Smith", amount: 150, date: "2024-02-10" },
        { id: 4, customer: "John Doe", amount: 90, date: "2024-02-25" },
        { id: 5, customer: "Jane Smith", amount: 200, date: "2024-03-05" },
        { id: 6, customer: "John Doe", amount: 50, date: "2024-03-15" },
      ]);
    }, 1000);
  });
};

const calculatePoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2 + 50;
  } else if (amount > 50) {
    points += (amount - 50) * 1;
  }
  return points;
};

const groupByCustomerAndMonth = (transactions) => {
  const rewards = {};
  transactions.forEach(({ customer, amount, date }) => {
    const month = date.substring(0, 7);
    const points = calculatePoints(amount);
    if (!rewards[customer]) rewards[customer] = { total: 0 };
    if (!rewards[customer][month]) rewards[customer][month] = 0;
    rewards[customer][month] += points;
    rewards[customer].total += points;
  });
  return rewards;
};

const RewardsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({});

  useEffect(() => {
    fetchTransactions().then((data) => {
      setTransactions(data);
      setRewards(groupByCustomerAndMonth(data));
    });
  }, []);

  return (
    <Card sx={{ padding: 2 }}>
      <CardContent>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Customer Rewards
        </h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(rewards).map(([customer, months]) =>
              Object.entries(months)
                .filter(([key]) => key !== "total")
                .map(([month, points]) => (
                  <TableRow key={`${customer}-${month}`}>
                    <TableCell>{customer}</TableCell>
                    <TableCell>{month}</TableCell>
                    <TableCell>{points}</TableCell>
                  </TableRow>
                ))
            )}
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Total Points Per Customer</strong>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            {Object.entries(rewards).map(([customer, months]) => (
              <TableRow key={`${customer}-total`}>
                <TableCell>{customer}</TableCell>
                <TableCell>All Months</TableCell>
                <TableCell>
                  <strong>{months.total}</strong>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RewardsTable;
