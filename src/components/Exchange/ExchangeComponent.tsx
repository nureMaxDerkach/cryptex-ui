// src/components/Exchange/ExchangeComponent.tsx
import {useState, useMemo} from 'react';
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
    Box,
    IconButton,
    InputAdornment,
    type SelectChangeEvent,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {type IWalletResponse, type IAmountOfCoin} from '../../types';
import {convertCoinAsync} from '../../api/exchangeApi';

const COIN_ID_MAP: { [key: number]: { name: string, symbol: string } } = {
    0: {name: 'Bitcoin', symbol: 'BTC'},
    1: {name: 'Ethereum', symbol: 'ETH'},
    2: {name: 'Litecoin', symbol: 'LTC'},
    3: {name: 'BNB', symbol: 'BNB'},
    4: {name: 'Solana', symbol: 'SOL'},
    5: {name: 'Ripple', symbol: 'XRP'},
};

interface ExchangeComponentProps {
    userData: IWalletResponse | null;
    isLoading: boolean;
    error: string | null;
    onExchangeSuccess: () => void;
}

export function ExchangeComponent({
                                      userData,
                                      isLoading,
                                      onExchangeSuccess
                                  }: ExchangeComponentProps) {
    const [coinFromId, setCoinFromId] = useState<string>('');
    const [coinToId, setCoinToId] = useState<string>('');
    const [amount, setAmount] = useState('');

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableCoins = useMemo(() => {
        return userData?.wallet?.amountOfCoins || [];
    }, [userData]);

    const coinFromData = useMemo(() => {
        if (!coinFromId) return null;
        return availableCoins.find(c => c.name === Number(coinFromId));
    }, [coinFromId, availableCoins]);

    const showAlert = (message: string, severity: AlertColor) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

    const handleSwap = () => {
        setCoinFromId(coinToId);
        setCoinToId(coinFromId);
    };

    const handleSetMax = () => {
        if (coinFromData) {
            setAmount(String(coinFromData.amount));
        }
    };

    const handleSubmit = async () => {
        if (!coinFromId || !coinToId || !amount) {
            showAlert('Please fill in all fields.', 'error');
            return;
        }
        if (coinFromId === coinToId) {
            showAlert('Cannot exchange the same currency.', 'error');
            return;
        }
        const exchangeAmount = Number(amount);
        if (exchangeAmount <= 0) {
            showAlert('Amount must be greater than zero.', 'error');
            return;
        }
        if (exchangeAmount > (coinFromData?.amount || 0)) {
            showAlert('Insufficient balance.', 'error');
            return;
        }

        setIsSubmitting(true);
        setAlertMessage(null);

        try {
            await convertCoinAsync(
                Number(coinFromId),
                Number(coinToId),
                exchangeAmount
            );

            const fromSymbol = COIN_ID_MAP[Number(coinFromId)]?.symbol || 'Crypto';
            const toSymbol = COIN_ID_MAP[Number(coinToId)]?.symbol || 'Crypto';

            showAlert(`Successfully exchanged ${amount} ${fromSymbol} to ${toSymbol}.`, 'success');

            setAmount('');

            onExchangeSuccess();

        } catch (error: any) {
            showAlert(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && !userData) {
        return <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4
        }}><CircularProgress/></Box>;
    }

    return (
        <Paper elevation={4}
               sx={{borderRadius: 3, p: 4, maxWidth: 600, margin: 'auto'}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Exchange Crypto
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

            <Grid container spacing={2} alignItems="center">
                {/* 1. Селектор "From" */}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>From</InputLabel>
                        <Select
                            value={coinFromId}
                            label="From"
                            onChange={(e: SelectChangeEvent) => setCoinFromId(e.target.value)}
                        >
                            {availableCoins.map((coin) => {
                                const coinInfo = COIN_ID_MAP[coin.name] || {
                                    name: 'Unknown',
                                    symbol: '???'
                                };
                                return (
                                    <MenuItem key={coin.name}
                                              value={String(coin.name)}>
                                        {coinInfo.name} ({coinInfo.symbol})
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                {/* 2. Поле суми */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Amount to Exchange"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        inputProps={{min: 0}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        onClick={handleSetMax}
                                        disabled={!coinFromId}
                                        size="small"
                                    >
                                        Max
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {coinFromData && (
                        <Typography variant="caption"
                                    color="text.secondary" sx={{ml: 1.5}}>
                            Balance: {coinFromData.amount.toFixed(6)} {COIN_ID_MAP[coinFromData.name]?.symbol}
                        </Typography>
                    )}
                </Grid>

                {/* 3. Кнопка "Swap" */}
                <Grid item xs={12} sx={{textAlign: 'center'}}>
                    <IconButton onClick={handleSwap} color="primary"
                                disabled={!coinFromId && !coinToId}>
                        <SwapHorizIcon/>
                    </IconButton>
                </Grid>

                {/* 4. Селектор "To" */}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>To</InputLabel>
                        <Select
                            value={coinToId}
                            label="To"
                            onChange={(e: SelectChangeEvent) => setCoinToId(e.target.value)}
                        >
                            {availableCoins.map((coin) => {
                                const coinInfo = COIN_ID_MAP[coin.name] || { name: 'Unknown', symbol: '???' };
                                return (
                                    <MenuItem key={coin.name} value={String(coin.name)}>
                                        {coinInfo.name} ({coinInfo.symbol})
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                {/* 5. Кнопка підтвердження */}
                <Grid item xs={12} sx={{mt: 2}}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !coinFromId || !coinToId || !amount}
                        sx={{height: 48}}
                    >
                        {isSubmitting ? <CircularProgress size={24}
                                                          color="inherit"/>
                                      : 'Confirm Exchange'}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}