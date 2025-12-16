import {
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import { useEffect, useState } from "react";
import type { IWalletResponse } from "../../types.ts";
import { Crypto } from "../../data/constants.ts";
import { Column } from "../Flex.tsx";
import { ContentCopy } from "@mui/icons-material";
import { depositCryptoAsync } from "../../api/depositApi.ts";

interface Props {
    userData: IWalletResponse | null;
    onDepositSuccess: () => void;
}

function DepositCrypto({ userData, onDepositSuccess }: Props) {
    const [crypto, setCrypto] = useState<Crypto>(Crypto.BTC);
    const [depositAddress, setDepositAddress] = useState<string>('');

    // Нові стейти для суми та процесу
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successOpen, setSuccessOpen] = useState(false);

    useEffect(() => {
        if (!userData) return;
        setDepositAddress(getDepositAddressByCrypto(crypto) || '');
    }, [userData]);

    const onCryptoChange = (event: any) => {
        const value = Number(event.target.value) as Crypto;
        setCrypto(value);
        setDepositAddress(getDepositAddressByCrypto(value) || '');
    };

    const getDepositAddressByCrypto = (cryptoVal: Crypto) => {
        return userData?.wallet.amountOfCoins.find(x => x.name === cryptoVal)?.depositAddress;
    };

    const handleDeposit = async () => {
        if (!userData || !depositAddress) return;

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount greater than 0");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await depositCryptoAsync(userData.id, depositAddress, numAmount);

            // Успіх
            setSuccessOpen(true);
            setAmount('');
            onDepositSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to deposit crypto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Column gap='20px'>
            <Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Select crypto and enter amount to simulate deposit.
                </Typography>

                <TextField
                    select
                    fullWidth
                    label="Crypto"
                    value={crypto}
                    onChange={onCryptoChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value={Crypto.BTC}>BTC</MenuItem>
                    <MenuItem value={Crypto.ETH}>ETH</MenuItem>
                    <MenuItem value={Crypto.LTC}>LTC</MenuItem>
                    <MenuItem value={Crypto.BNB}>BNB</MenuItem>
                    <MenuItem value={Crypto.SOLANA}>Solana</MenuItem>
                    <MenuItem value={Crypto.RIPPLE}>Ripple</MenuItem>
                </TextField>
            </Grid>

            {/* Поле адреси */}
            <Grid>
                <TextField
                    fullWidth
                    label="Deposit address"
                    value={depositAddress}
                    disabled
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => {
                                        if (depositAddress) navigator.clipboard.writeText(depositAddress);
                                    }}
                                    edge="end"
                                >
                                    <ContentCopy />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            {/* Поле суми */}
            <Grid>
                <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    InputProps={{
                        inputProps: { min: 0, step: "any" }
                    }}
                />
            </Grid>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleDeposit}
                disabled={isLoading || !amount || !depositAddress}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Deposit'}
            </Button>

            {/* Сповіщення про успіх */}
            <Snackbar
                open={successOpen}
                autoHideDuration={4000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Deposit successful! Check your wallet.
                </Alert>
            </Snackbar>
        </Column>
    )
}

export default DepositCrypto;