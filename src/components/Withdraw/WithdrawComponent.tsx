// src/components/Withdraw/WithdrawComponent.tsx
import { useState } from 'react';
import {
    Button,
    Grid,
    TextField,
    Typography,
    Paper,
    Alert,
    type AlertColor,
    CircularProgress,
    Box,
    InputAdornment,
} from '@mui/material';
import { type IWalletResponse } from '../../types';
import { withdrawFiatAsync } from '../../api/withdrawApi';

interface WithdrawComponentProps {
    userData: IWalletResponse | null;
    isLoading: boolean;
    error: string | null;
    onWithdrawSuccess: () => void;
}

export function WithdrawComponent({ userData, isLoading, onWithdrawSuccess }: WithdrawComponentProps) {
    const [amount, setAmount] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Текущий фиатный баланс пользователя
    const currentBalance = userData?.balance || 0;

    const showAlert = (message: string, severity: AlertColor) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

    // Установить максимальную сумму
    const handleSetMax = () => {
        setAmount(String(currentBalance));
    };

    const handleSubmit = async () => {
        const withdrawAmount = Number(amount);

        // Валидация
        if (withdrawAmount <= 0) {
            showAlert('Amount must be greater than zero.', 'error');
            return;
        }
        if (withdrawAmount > currentBalance) {
            showAlert('Insufficient USD balance for this withdrawal.', 'error');
            return;
        }

        setIsSubmitting(true);
        setAlertMessage(null);

        try {
            // Вызываем наш новый API
            await withdrawFiatAsync(withdrawAmount);

            showAlert(`Withdrawal of $${withdrawAmount} successful.`, 'success');

            setAmount('');
            onWithdrawSuccess();

        } catch (error: any) {
            showAlert(error.message || 'Withdrawal failed.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper elevation={4} sx={{ borderRadius: 3, p: 4, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Withdraw USD
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Your current balance: <b>${currentBalance.toFixed(2)}</b>
            </Typography>

            {alertMessage && (
                <Alert
                    onClose={() => setAlertMessage(null)}
                    severity={alertSeverity}
                    sx={{ mb: 3 }}
                >
                    {alertMessage}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Amount (USD)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        inputProps={{ min: 0 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={handleSetMax} size="small">
                                        Max
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                        This will withdraw funds from your main USD balance.
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !amount || Number(amount) <= 0}
                        sx={{ height: 48 }}
                    >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Withdraw'}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}