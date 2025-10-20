import {useState} from 'react';
import {
    Button,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    InputLabel,
    FormControl,
    Paper,
    Alert,
} from '@mui/material';
import {CRYPTO_PAIRS} from '../../data/constants.ts';

export function SaleAndPurchaseCryptoComponent() {
    const [tradingPair, setTradingPair] = useState('BTC/USDT');
    const [buyAmount, setBuyAmount] = useState('');
    const [sellAmount, setSellAmount] = useState('');
    const [orderType] = useState('Market');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleBuy = () => {
        setAlertMessage(`Buy order placed: ${buyAmount} ${tradingPair} at ${orderType}`);
        setBuyAmount('');
    };

    const handleSell = () => {
        setAlertMessage(`Sell order placed: ${sellAmount} ${tradingPair} at ${orderType}`);
        setSellAmount('');
    };

    const [base, quote] = tradingPair.split('/');

    return (
        <Paper elevation={4} sx={{borderRadius: 3, p: 4}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Trade Cryptocurrency
            </Typography>

            {alertMessage && (
                <Alert
                    onClose={() => setAlertMessage(null)}
                    severity="info"
                    sx={{mb: 3}}
                >
                    {alertMessage}
                </Alert>
            )}

            {/* Trading Pair Selector */}
            <FormControl fullWidth sx={{mb: 4}}>
                <InputLabel>Trading Pair</InputLabel>
                <Select
                    value={tradingPair}
                    label="Trading Pair"
                    onChange={(e) => setTradingPair(e.target.value)}
                >
                    {CRYPTO_PAIRS.map((pair) => (
                        <MenuItem key={pair} value={pair}>
                            {pair}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Buy / Sell Panels */}
            <Grid container spacing={3}>
                {/* Buy Section */}
                <Grid>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(46, 125, 50, 0.05)',
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold"
                                    color="success.main" gutterBottom>
                            Buy {base}
                        </Typography>

                        <FormControl fullWidth sx={{mb: 2}}>
                            <InputLabel>Order Type</InputLabel>
                            <Select value={orderType} label="Order Type"
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Limit" disabled>
                                    Limit (Coming Soon)
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            type="number"
                            label={`Amount (${quote})`}
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            placeholder={`Enter amount in ${quote}`}
                            inputProps={{min: 0}}
                            sx={{mb: 3}}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={handleBuy}
                            disabled={!buyAmount}
                        >
                            Buy {base}
                        </Button>
                    </Paper>
                </Grid>

                {/* Sell Section */}
                <Grid>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(211, 47, 47, 0.05)',
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold"
                                    color="error.main" gutterBottom>
                            Sell {base}
                        </Typography>

                        <FormControl fullWidth sx={{mb: 2}}>
                            <InputLabel>Order Type</InputLabel>
                            <Select value={orderType} label="Order Type"
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Limit" disabled>
                                    Limit (Coming Soon)
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            type="number"
                            label={`Amount (${quote})`}
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            placeholder={`Enter amount in ${quote}`}
                            inputProps={{min: 0}}
                            sx={{mb: 3}}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={handleSell}
                            disabled={!sellAmount}
                        >
                            Sell {base}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
}
