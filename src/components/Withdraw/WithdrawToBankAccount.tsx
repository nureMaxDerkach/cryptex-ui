import {
    Alert,
    type AlertColor,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    InputAdornment,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EmailIcon from "@mui/icons-material/Email";
import {withdrawFiatAsync} from "../../api/withdrawApi.ts";
import type {IWalletResponse} from "../../types.ts";

interface Props {
    userData: IWalletResponse | null;
    onWithdrawSuccess: () => void;
}

export function WithdrawToBankAccount({onWithdrawSuccess, userData}: Props) {
    // --- Form State ---
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // --- UI State ---
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Verification Modal State ---
    const [openVerify, setOpenVerify] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [codeError, setCodeError] = useState(false); // <-- НОВЫЙ СТЕЙТ ДЛЯ ОШИБКИ КОДА

    const currentBalance = userData?.balance || 0;

    // --- Helpers ---
    const showAlert = (message: string, severity: AlertColor) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
    };

    const handleSetMax = () => {
        setAmount(String(currentBalance));
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 16);
        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 3) {
            setExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
        } else {
            setExpiry(val);
        }
    };

    // --- Step 1: Validate and Open Modal ---
    const handleInitiateWithdraw = () => {
        const withdrawAmount = Number(amount);

        if (withdrawAmount <= 0) {
            showAlert('Amount must be greater than zero.', 'error');
            return;
        }
        if (withdrawAmount > currentBalance) {
            showAlert('Insufficient USD balance.', 'error');
            return;
        }
        if (cardNumber.replace(/\s/g, '').length < 16) {
            showAlert('Please enter a valid 16-digit card number.', 'error');
            return;
        }
        if (!expiry || !cvv || !cardHolder) {
            showAlert('Please fill in all card details.', 'error');
            return;
        }

        // Сброс ошибок и открытие модалки
        setAlertMessage(null);
        setCodeError(false);
        setVerificationCode('');
        setOpenVerify(true);
    };

    // --- Step 2: Confirm and API Call (ИСПРАВЛЕНО) ---
    const handleFinalConfirmation = async () => {
        // 1. Явная валидация кода
        if (verificationCode.length < 4) {
            setCodeError(true); // Показываем красную ошибку в инпуте
            return;
        }

        setOpenVerify(false); // Закрываем модалку
        setIsSubmitting(true); // Включаем спиннер

        try {
            const withdrawAmount = Number(amount);

            console.log(`Attempting to withdraw: $${withdrawAmount}...`);

            // 2. Вызов API
            await withdrawFiatAsync(withdrawAmount);

            console.log('Withdraw successful!');

            showAlert(`Success! $${withdrawAmount} sent to card ending in ${cardNumber.slice(-4)}.`, 'success');

            // 3. Очистка формы
            setAmount('');
            setCardNumber('');
            setCardHolder('');
            setExpiry('');
            setCvv('');
            setVerificationCode('');

            // 4. ОБНОВЛЕНИЕ БАЛАНСА
            onWithdrawSuccess();

        } catch (error: any) {
            console.error('Withdraw error:', error);
            showAlert(error.message || 'Withdrawal failed. Check console for details.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            {alertMessage && (
                <Alert onClose={() => setAlertMessage(null)} severity={alertSeverity} sx={{mb: 3}}>
                    {alertMessage}
                </Alert>
            )}

            {/* Currency & Amount */}
            <Grid size={{xs: 4}}>
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
            <Grid size={{xs: 8}}>
                <TextField
                    fullWidth
                    type="number"
                    label="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputProps={{min: 0}}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={handleSetMax} size="small">Max</Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            <Grid size={{xs: 12}}>
                <Typography variant="subtitle2" sx={{mb: 1, mt: 1}}>Card Details</Typography>
            </Grid>

            {/* Card Details */}
            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    label="Card Number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CreditCardIcon color="action"/>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="JOHN DOE"
                />
            </Grid>

            <Grid size={{xs: 6}}>
                <TextField
                    fullWidth
                    label="Expiry (MM/YY)"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                />
            </Grid>
            <Grid size={{xs: 6}}>
                <TextField
                    fullWidth
                    type="password"
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    placeholder="123"
                />
            </Grid>

            <Grid size={{xs: 12}}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleInitiateWithdraw}
                    disabled={isSubmitting}
                    sx={{height: 48, mt: 2}}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit"/> : 'Proceed to Verification'}
                </Button>
            </Grid>

            <Dialog open={openVerify} onClose={() => setOpenVerify(false)}>
                <DialogTitle sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <EmailIcon color="primary"/> Security Verification
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{mb: 2}}>
                        We have sent a confirmation code to your email <b>{userData?.email}</b>.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Verification Code"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={verificationCode}
                        onChange={(e) => {
                            setVerificationCode(e.target.value);
                            setCodeError(false); // Убираем ошибку при вводе
                        }}
                        placeholder="e.g. 123456"
                        error={codeError} // <-- ПОДСВЕТКА ОШИБКИ
                        helperText={codeError ? "Code must be at least 4 digits" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenVerify(false)} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleFinalConfirmation}
                        variant="contained"
                        disabled={!verificationCode}
                    >
                        Confirm Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}