import {
    type AlertColor,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Box
} from "@mui/material";
import { useEffect, useState } from "react";
import { Column, Row } from "../Flex.tsx";
import type { IWalletResponse } from "../../types.ts";
import { Crypto } from "../../data/constants.ts";
import { withdrawCryptoAsync } from "../../api/withdrawApi.ts";

interface Props {
    userData: IWalletResponse | null;
    onWithdrawSuccess: () => void;
    availableBalance: number | null;
    setAvailableBalance: React.Dispatch<React.SetStateAction<number | null>>;
    showAlert: (message: string, severity: AlertColor) => void;
}

export function WithdrawOnChain({ userData, onWithdrawSuccess, availableBalance, setAvailableBalance, showAlert }: Props) {
    const [crypto, setCrypto] = useState<Crypto>(Crypto.BTC);
    const [address, setAddress] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [amountStr, setAmountStr] = useState<string>('');

    const getCoinBalance = (coinEnum: Crypto) => {
        return userData?.wallet.amountOfCoins.find(x => x.name === coinEnum)?.amount || 0;
    };

    useEffect(() => {
        const balance = getCoinBalance(crypto);
        setAvailableBalance(balance);
    }, [userData, crypto, setAvailableBalance]);

    const onCryptoChange = (event: any) => {
        const newCrypto = event.target.value as Crypto;
        setCrypto(newCrypto);
        setAmountStr('');
    };

    const handleSetMax = () => {
        if (availableBalance !== null) {
            setAmountStr(availableBalance.toString());
        }
    };

    const handleSubmit = async () => {
        const withdrawAmount = parseFloat(amountStr);

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            showAlert('Amount must be greater than zero.', 'error');
            return;
        }

        if (availableBalance !== null && withdrawAmount > availableBalance) {
            showAlert('Insufficient balance.', 'error');
            return;
        }

        if (!address.trim()) {
            showAlert('Please enter a valid wallet address.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            await withdrawCryptoAsync(crypto, withdrawAmount, address);

            showAlert(`Success! ${withdrawAmount} ${Crypto[crypto]} sent to ${address}.`, 'success');

            setAmountStr('');
            setAddress('');

            onWithdrawSuccess();
        } catch (e: any) {
            console.error(e);
            showAlert(e.message || 'Withdrawal failed.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Column width="100%" gap='20px'>
            <Row>
                <TextField
                    fullWidth
                    name="address"
                    value={address}
                    label="Wallet Address"
                    placeholder="Enter recipient address"
                    onChange={(e) => setAddress(e.target.value)}
                />
            </Row>

            <Row>
                <FormControl fullWidth>
                    <InputLabel>Crypto</InputLabel>
                    <Select
                        value={crypto}
                        label="Crypto"
                        onChange={onCryptoChange}
                    >
                        <MenuItem value={Crypto.BTC}>Bitcoin (BTC)</MenuItem>
                        <MenuItem value={Crypto.ETH}>Ethereum (ETH)</MenuItem>
                        <MenuItem value={Crypto.LTC}>Litecoin (LTC)</MenuItem>
                        <MenuItem value={Crypto.BNB}>BNB</MenuItem>
                        <MenuItem value={Crypto.SOLANA}>Solana (SOL)</MenuItem>
                        <MenuItem value={Crypto.RIPPLE}>Ripple (XRP)</MenuItem>
                    </Select>
                </FormControl>
            </Row>

            {/* Відображення доступного балансу */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                <Typography variant="caption" color="text.secondary">
                    Available: <b>{availableBalance?.toFixed(6)} {Crypto[crypto]}</b>
                </Typography>
            </Box>

            <Grid container>
                <TextField
                    fullWidth
                    type="number"
                    label='Amount'
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="0.00"
                    inputProps={{ min: 0, step: "any" }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={handleSetMax} size="small" sx={{ minWidth: 'auto' }}>
                                    Max
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            <Grid container>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !amountStr || parseFloat(amountStr) <= 0 || !address}
                    sx={{ height: 48 }}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Withdraw'}
                </Button>
            </Grid>
        </Column>
    );
}