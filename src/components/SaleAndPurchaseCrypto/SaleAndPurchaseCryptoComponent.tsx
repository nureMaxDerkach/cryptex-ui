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
    type AlertColor,
    CircularProgress,
    type SelectChangeEvent,
} from '@mui/material';
import {CRYPTO_PAIRS} from '../../data/constants.ts';
import {buyCoinAsync, sellCoinAsync} from '../../api/tradeApi.ts';
import {getUserIdFromToken} from '../../utils/authUtils.ts';

const COIN_NAME_TO_ID: { [key: string]: number } = {
    'BTC': 0,
    'ETH': 1,
    'LTC': 2,
    'BNB': 3,
    'SOL': 4,
    'XRP': 5,
};

interface SaleAndPurchaseCryptoComponentProps {
    onTradeSuccess: () => void;
}

export function SaleAndPurchaseCryptoComponent({ onTradeSuccess }: SaleAndPurchaseCryptoComponentProps) {
    const [tradingPair, setTradingPair] = useState('BTC/USDT');
    const [buyAmount, setBuyAmount] = useState('');
    const [sellAmount, setSellAmount] = useState('');

    // Стан для Лімітних ордерів
    const [orderType, setOrderType] = useState('Market');
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');

    const [isSubmittingBuy, setIsSubmittingBuy] = useState(false);
    const [isSubmittingSell, setIsSubmittingSell] = useState(false);

    const showAlert = (message: string, severity: AlertColor) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

    const handleOrderTypeChange = (event: SelectChangeEvent) => {
        setOrderType(event.target.value as string);
        setBuyPrice('');
        setSellPrice('');
    };

    const [base, quote] = tradingPair.split('/');

    const handleBuy = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            showAlert('User not authenticated. Please log in again.', 'error');
            return;
        }

        const coinId = COIN_NAME_TO_ID[base];
        if (coinId === undefined) {
            showAlert('Selected trading pair is not supported.', 'error');
            return;
        }

        setIsSubmittingBuy(true);
        setAlertMessage(null);

        if (orderType === 'Market') {
            try {
                await buyCoinAsync(userId, coinId, Number(buyAmount));
                showAlert(`Market buy order for ${buyAmount} ${base} filled.`, 'success');
                setBuyAmount('');
                onTradeSuccess();
            } catch (error: any) {
                showAlert(error.message, 'error');
            } finally {
                setIsSubmittingBuy(false);
            }
        } else {
            await new Promise(res => setTimeout(res, 500));
            showAlert(`Limit buy order placed for ${buyAmount} ${base} at $${buyPrice}`, 'success');
            setBuyAmount('');
            setBuyPrice('');
            setIsSubmittingBuy(false);
        }
    };

    const handleSell = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            showAlert('User not authenticated. Please log in again.', 'error');
            return;
        }

        const coinId = COIN_NAME_TO_ID[base];
        if (coinId === undefined) {
            showAlert('Selected trading pair is not supported.', 'error');
            return;
        }

        setIsSubmittingSell(true);
        setAlertMessage(null);

        if (orderType === 'Market') {
            try {
                await sellCoinAsync(userId, coinId, Number(sellAmount));
                showAlert(`Market sell order for ${sellAmount} ${base} filled.`, 'success');
                setSellAmount('');
                onTradeSuccess();
            } catch (error: any) {
                showAlert(error.message, 'error');
            } finally {
                setIsSubmittingSell(false);
            }
        } else {
            // Логіка Limit Order (імітація)
            await new Promise(res => setTimeout(res, 500));
            showAlert(`Limit sell order placed for ${sellAmount} ${base} at $${sellPrice}`, 'success');
            setSellAmount('');
            setSellPrice('');
            setIsSubmittingSell(false);
        }
    };

    return (
        <Paper elevation={4} sx={{borderRadius: 3, p: 4}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Trade Cryptocurrency
            </Typography>

            {alertMessage && (
                <Alert
                    onClose={() => setAlertMessage(null)}
                    severity={alertSeverity}
                    sx={{mb: 3}}
                >
                    {alertMessage}
                </Alert>
            )}

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

            <Grid container spacing={3}>
                {/* Buy Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(46, 125, 50, 0.05)' }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" color="success.main" gutterBottom>
                            Buy {base}
                        </Typography>

                        <FormControl fullWidth sx={{mb: 2}}>
                            <InputLabel>Order Type</InputLabel>
                            <Select
                                value={orderType}
                                label="Order Type"
                                onChange={handleOrderTypeChange}
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Limit">Limit</MenuItem>
                            </Select>
                        </FormControl>

                        {orderType === 'Limit' && (
                            <TextField
                                fullWidth
                                type="number"
                                label={`Limit Price (${quote})`}
                                value={buyPrice}
                                onChange={(e) => setBuyPrice(e.target.value)}
                                placeholder={`Enter price in ${quote}`}
                                inputProps={{min: 0}}
                                sx={{mb: 2}}
                                disabled={isSubmittingBuy}
                            />
                        )}

                        <TextField
                            fullWidth
                            type="number"
                            label={`Amount (${base})`}
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            placeholder={`Enter amount in ${base}`}
                            inputProps={{min: 0}}
                            sx={{mb: 3}}
                            disabled={isSubmittingBuy}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={handleBuy}
                            disabled={
                                !buyAmount ||
                                (orderType === 'Limit' && !buyPrice) ||
                                isSubmittingBuy ||
                                isSubmittingSell
                            }
                            sx={{height: 40}}
                        >
                            {isSubmittingBuy ? <CircularProgress size={24} color="inherit"/>
                                : `Buy ${base}`}
                        </Button>
                    </Paper>
                </Grid>

                {/* Sell Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.05)' }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" color="error.main" gutterBottom>
                            Sell {base}
                        </Typography>

                        <FormControl fullWidth sx={{mb: 2}}>
                            <InputLabel>Order Type</InputLabel>
                            <Select
                                value={orderType}
                                label="Order Type"
                                onChange={handleOrderTypeChange}
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Limit">Limit</MenuItem>
                            </Select>
                        </FormControl>

                        {orderType === 'Limit' && (
                            <TextField
                                fullWidth
                                type="number"
                                label={`Limit Price (${quote})`}
                                value={sellPrice}
                                onChange={(e) => setSellPrice(e.target.value)}
                                placeholder={`Enter price in ${quote}`}
                                inputProps={{min: 0}}
                                sx={{mb: 2}}
                                disabled={isSubmittingSell}
                            />
                        )}

                        <TextField
                            fullWidth
                            type="number"
                            label={`Amount (${base})`}
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            placeholder={`Enter amount in ${base}`}
                            inputProps={{min: 0}}
                            sx={{mb: 3}}
                            disabled={isSubmittingSell}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={handleSell}
                            disabled={
                                !sellAmount ||
                                (orderType === 'Limit' && !sellPrice) ||
                                isSubmittingSell ||
                                isSubmittingBuy
                            }
                            sx={{height: 40}}
                        >
                            {isSubmittingSell ? <CircularProgress size={24} color="inherit"/>
                                : `Sell ${base}`}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
}