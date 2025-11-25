// src/components/Deposit/DepositComponent.tsx
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
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { depositFiatAsync } from '../../api/depositApi';

interface DepositComponentProps {
    onDepositSuccess: () => void;
}

export function DepositComponent({ onDepositSuccess }: DepositComponentProps) {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [paymentMethod, setPaymentMethod] = useState('card');

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Helpers ---
    const showAlert = (message: string, severity: AlertColor) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

    // Simple card formatting
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 16);
        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };

    const handleSubmit = async () => {
        const depositAmount = Number(amount);

        // --- Validation ---
        if (depositAmount <= 0) {
            showAlert('Amount must be greater than zero.', 'error');
            return;
        }

        if (paymentMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 16 || !expiry || !cvv) {
                showAlert('Please enter valid card details.', 'error');
                return;
            }
        }

        setIsSubmitting(true);
        setAlertMessage(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            await depositFiatAsync(depositAmount);

            showAlert(`Successfully deposited $${depositAmount} to your account.`, 'success');

            setAmount('');
            setCardNumber('');
            setExpiry('');
            setCvv('');

            // Refresh data in TabsComponent
            onDepositSuccess();

        } catch (error: any) {
            showAlert(error.message || 'Deposit failed.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');

        const truncatedValue = rawValue.substring(0, 4);

        if (truncatedValue.length >= 3) {
            setExpiry(`${truncatedValue.slice(0, 2)}/${truncatedValue.slice(2)}`);
        } else {
            setExpiry(truncatedValue);
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCvv(val);
    };

    return (
        <Paper elevation={4} sx={{ borderRadius: 3, p: 4, maxWidth: 600, margin: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold">
                    Deposit Funds
                </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select currency and payment method to add funds to your wallet.
            </Typography>

            {alertMessage && (
                <Alert onClose={() => setAlertMessage(null)} severity={alertSeverity} sx={{ mb: 3 }}>
                    {alertMessage}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* 1. Currency & Amount */}
                <Grid item xs={4}>
                    <TextField
                        select
                        fullWidth
                        label="Currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR" disabled>EUR</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        inputProps={{ min: 0 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }}>Payment Method</Divider>
                </Grid>

                {/* 2. Payment Method Selection */}
                <Grid item xs={12}>
                    <RadioGroup
                        row
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CreditCardIcon sx={{ mr: 1 }} /> Bank Card
                                </Box>
                            }
                        />
                        <FormControlLabel
                            value="bank_transfer"
                            control={<Radio />}
                            label="Bank Transfer"
                            disabled
                        />
                    </RadioGroup>
                </Grid>

                {/* 3. Card Details (Conditional) */}
                {paymentMethod === 'card' && (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Card Number"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="0000 0000 0000 0000"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CreditCardIcon color="action" /></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Expiry (MM/YY)"
                                value={expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY"
                                inputProps={{ maxLength: 5 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="CVV"
                                value={cvv}
                                onChange={handleCvvChange}
                                placeholder="123"
                                inputProps={{ maxLength: 3 }}
                            />
                        </Grid>
                    </>
                )}

                {/* 4. Submit Button */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !amount || Number(amount) <= 0}
                        sx={{ height: 48 }}
                    >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : `Pay $${amount || '0'}`}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}