import {
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
import {useState} from "react";
import {Column, Row} from "../Flex.tsx";
import type {IWalletResponse} from "../../types.ts";

// TODO: fix it
enum ChainTypes {
    ETH = "ETH",
    ARB = "ARB",
    TON = "TON",
}

enum Crypto {
    BTC = 0,
    ETH = 1,
    LTC = 2,
    BNB = 3,
    SOLANA = 4,
    RIPPLE = 5,
    USDT = 6,
}

interface Props {
    userData: IWalletResponse | null;
    onWithdrawSuccess: () => void;
    availableBalance: number | null;
    setAvailableBalance: React.Dispatch<React.SetStateAction<number | null>>
}

export function WithdrawOnChain({userData, onWithdrawSuccess, availableBalance, setAvailableBalance}: Props) {
    const [chainType, setChainType] = useState<ChainTypes | null>(null);
    const [crypto, setCrypto] = useState<Crypto | null>(Crypto.USDT);
    const [address, setAddress] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [amount, setAmount] = useState<number | null>(null);

    const onCryptoChange = (event: any) => {
        if (event.target.value as Crypto === Crypto.USDT) {
            setCrypto(event.target.value as Crypto);
            setAvailableBalance(userData?.balance as number);
            return;
        }
        setCrypto(event.target.value as Crypto);

        const coin = userData?.wallet.amountOfCoins.find(x => x.name == event.target.value);
        setAvailableBalance(coin?.amount || 0);
    }

    const onChainTypeChange = (event: any) => {
        setChainType(event.target.value as ChainTypes);
    }

    const handleSetMax = () => {
        setAmount(availableBalance);
    };

    const handleSubmit = () => {
        try {
            setIsSubmitting(true);
            console.log("Sending...");
        } catch (e) {
            console.error(e);
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
                        <MenuItem value={Crypto.USDT}>USDT</MenuItem>
                        <MenuItem value={Crypto.BTC}>BTC</MenuItem>
                        <MenuItem value={Crypto.ETH}>ETH</MenuItem>
                        <MenuItem value={Crypto.LTC}>LTC</MenuItem>
                        <MenuItem value={Crypto.BNB}>BNB</MenuItem>
                        <MenuItem value={Crypto.SOLANA}>Solana</MenuItem>
                        <MenuItem value={Crypto.RIPPLE}>Ripple</MenuItem>
                    </Select>
                </FormControl>
            </Row>
            <Row>
                <FormControl fullWidth={true}>
                    <InputLabel>Chain type</InputLabel>
                    <Select
                        value={chainType}
                        label="Network"
                        onChange={onChainTypeChange}
                    >
                        <MenuItem value={ChainTypes.ETH}>ETH</MenuItem>
                        <MenuItem value={ChainTypes.ARB}>ARB</MenuItem>
                        <MenuItem value={ChainTypes.TON}>TON</MenuItem>
                    </Select>
                </FormControl>
            </Row>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    type="number"
                    label='Amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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