import React, {useState, useEffect} from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Typography,
    Paper
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {Crypto, BinanceInterval} from '../../data/constants.ts';
import {fetchCoinPriceHistory} from "../../api/coinPricesApi.ts";
import type {ICoinPrice} from "../../types.ts";

// Допоміжні масиви для відображення в Select
const cryptoOptions = Object.keys(Crypto)
    .filter((k) => isNaN(Number(k)))
    .map((key) => ({
        label: key,
        value: Crypto[key as keyof typeof Crypto]
    }));

const intervalOptions = Object.keys(BinanceInterval)
    .filter((k) => isNaN(Number(k)))
    .map((key) => ({
        // Прибираємо підкреслення для красивого відображення (наприклад _1h -> 1h)
        label: key.replace('_', ''),
        value: BinanceInterval[key as keyof typeof BinanceInterval]
    }));

export const CoinPricesComponent: React.FC = () => {
    const [selectedCoin, setSelectedCoin] = useState<Crypto>(Crypto.BTC);
    const [selectedInterval, setSelectedInterval] = useState<BinanceInterval>(BinanceInterval._4h);

    const [chartData, setChartData] = useState<ICoinPrice[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchCoinPriceHistory(selectedCoin, selectedInterval);
                setChartData(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to fetch price history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedCoin, selectedInterval]);

    const formatDateTick = (dateStr: string) => {
        const date = new Date(dateStr);

        if (selectedInterval <= 10) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (selectedInterval <= 12) {
            return date.toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit'
            });
        } else {
            // Варіант 1: Короткий місяць і рік (en-US дає "Oct 24")
            return date.toLocaleDateString('en-US', {
                month: 'short',
                year: '2-digit'
            });

            // Варіант 2 (цифровий):
            // return date.toLocaleDateString([], { month: '2-digit', year: 'numeric' });
        }
    };

    const formatTooltipDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString([], {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Box sx={{p: 2}}>
            <Box sx={{display: 'flex', gap: 2, mb: 4}}>
                <FormControl sx={{minWidth: 120}}>
                    <InputLabel>Coin</InputLabel>
                    <Select
                        value={selectedCoin}
                        label="Coin"
                        onChange={(e) => setSelectedCoin(Number(e.target.value))}
                    >
                        {cryptoOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{minWidth: 120}}>
                    <InputLabel>Interval</InputLabel>
                    <Select
                        value={selectedInterval}
                        label="Interval"
                        onChange={(e) => setSelectedInterval(Number(e.target.value))}
                    >
                        {intervalOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {isLoading && <CircularProgress/>}

            {error && <Alert severity="error">{error}</Alert>}

            {!isLoading && !error && chartData.length > 0 && (
                <Paper sx={{p: 2, height: 400}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>

                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDateTick}
                                minTickGap={30}
                            />

                            <YAxis domain={['auto', 'auto']}/>

                            <Tooltip
                                labelFormatter={formatTooltipDate}
                                formatter={(value: number | undefined) => [value != null
                                                               ? value.toFixed(2)
                                                               : '',
                                    'Price',]}
                            />

                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                dot={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            )}

            {!isLoading && !error && chartData.length === 0 && (
                <Typography>No data available for this
                    selection.</Typography>
            )}
        </Box>
    );
};