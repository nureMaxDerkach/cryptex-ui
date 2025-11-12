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
    type AlertColor,
    CircularProgress,
    type SelectChangeEvent,
} from '@mui/material';
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
    const [tradingPair] = useState('BTC/USDT');

    // Стан для сум
    const [buyAmount, setBuyAmount] = useState('');
    const [sellAmount, setSellAmount] = useState('');

    // --- НОВИЙ СТАН ДЛЯ ЛІМІТНИХ ОРДЕРІВ ---
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

    // --- ОНОВЛЕНА ЛОГІКА КУПІВЛІ ---
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
                onTradeSuccess(); // Викликаємо оновлення гаманця
            } catch (error: any) {
                showAlert(error.message, 'error');
            } finally {
                setIsSubmittingBuy(false);
            }
        } else {
            // TODO: Замінити на реальний API-виклик, коли він з'явиться
            await new Promise(res => setTimeout(res, 500));
            showAlert(`Limit buy order placed for ${buyAmount} ${base} at $${buyPrice}`, 'success');
            setBuyAmount('');
            setBuyPrice('');
            setIsSubmittingBuy(false);
            // не викликаємо onTradeSuccess(), оскільки ордер ще не виконаний
        }
    };

    // --- ОНОВЛЕНА ЛОГІКА ПРОДАЖУ ---
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
                onTradeSuccess(); // Викликаємо оновлення гаманця
            } catch (error: any) {
                showAlert(error.message, 'error');
            } finally {
                setIsSubmittingSell(false);
            }
        } else {
            // TODO: Замінити на реальний API-виклик, коли він з'явиться
            await new Promise(res => setTimeout(res, 500));
            showAlert(`Limit sell order placed for ${sellAmount} ${base} at $${sellPrice}`, 'success');
            setSellAmount('');
            setSellPrice('');
            setIsSubmittingSell(false);
        }
    };

    return (
        <Paper elevation={4} sx={{borderRadius: 3, p: 4}}>
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

                        {/* --- ОНОВЛЕНО: ВИБІР ТИПУ ОРДЕРА --- */}
                        <FormControl fullWidth sx={{mb: 2}}>
                            <InputLabel>Order Type</InputLabel>
                            <Select
                                value={orderType}
                                label="Order Type"
                                onChange={handleOrderTypeChange} // Додано
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Limit">Limit</MenuItem> {/* Більше не disabled */}
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
                                sx={{mb: 2}} // Змінено з mb: 3
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

                        {/* --- ОНОВЛЕНО: ВИБІР ТИПУ ОРДЕРА --- */}
                        <FormControl fullWidth sx={{mb: 2}}>
                            <InputLabel>Order Type</InputLabel>
                            <Select
                                value={orderType}
                                label="Order Type"
                                onChange={handleOrderTypeChange} // Додано
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Limit">Limit</MenuItem> {/* Більше не disabled */}
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
                                sx={{mb: 2}} // Змінено з mb: 3
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