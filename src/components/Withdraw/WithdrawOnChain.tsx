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
} from "@mui/material";
import {useEffect, useState} from "react";
import {Column, Row} from "../Flex.tsx";
import type {IWalletResponse} from "../../types.ts";
import {Crypto} from "../../data/constants.ts";
import {withdrawCryptoAsync} from "../../api/withdrawApi.ts";

interface Props {
    userData: IWalletResponse | null;
    onWithdrawSuccess: () => void;
    availableBalance: number | null;
    setAvailableBalance: React.Dispatch<React.SetStateAction<number | null>>;
    showAlert: (message: string, severity: AlertColor) => void;
}

export function WithdrawOnChain({userData, onWithdrawSuccess, availableBalance, setAvailableBalance, showAlert}: Props) {
    const [crypto, setCrypto] = useState<Crypto>(Crypto.BTC);
    const [address, setAddress] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);

    useEffect(() => {
        const updatedAmount = userData?.wallet.amountOfCoins.find(x => x.name === crypto)?.amount;

        if (availableBalance != updatedAmount) {
            setAvailableBalance(updatedAmount || 0);
        }
    }, [userData]);

    const onCryptoChange = (event: any) => {
        setCrypto(event.target.value as Crypto);
        const coin = userData?.wallet.amountOfCoins.find(x => x.name == event.target.value);
        setAvailableBalance(coin?.amount || 0);
    }

    const handleSetMax = () => {
        setAmount(availableBalance || 0);
    };

    const handleSubmit = async () => {
        const withdrawAmount = Number(amount);

        if (withdrawAmount <= 0) {
            showAlert('Amount must be greater than zero.', 'error');
            return;
        }

        if (availableBalance != null && withdrawAmount > availableBalance) {
            showAlert('Insufficient balance.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            await withdrawCryptoAsync(crypto, amount, address);

            showAlert(`Success! ${amount} ${Crypto[crypto]} was sent to address ${address}.`, 'success');

            setAmount(0);
            setAddress('');

            onWithdrawSuccess();
        } catch (e: any) {
            console.error(e);
            showAlert(e.message || 'Withdrawal failed.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Column width="100%" gap='20px'>
            <Row>
                <TextField
                    fullWidth
                    name="address"
                    value={address}
                    label="Address"
                    onChange={(e: any) => setAddress(e.target.value)}
                />
            </Row>
            <Row>
                <FormControl fullWidth={true}>
                    <InputLabel>Crypto</InputLabel>
                    <Select
                        value={crypto}
                        label="Crypto"
                        onChange={onCryptoChange}
                    >
                        <MenuItem value={Crypto.BTC}>BTC</MenuItem>
                        <MenuItem value={Crypto.ETH}>ETH</MenuItem>
                        <MenuItem value={Crypto.LTC}>LTC</MenuItem>
                        <MenuItem value={Crypto.BNB}>BNB</MenuItem>
                        <MenuItem value={Crypto.SOLANA}>Solana</MenuItem>
                        <MenuItem value={Crypto.RIPPLE}>Ripple</MenuItem>
                    </Select>
                </FormControl>
            </Row>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    type="number"
                    label='Amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="0.00"
                    inputProps={{ min: 0 }}
                    InputProps={{
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
        </Column>
    )
}