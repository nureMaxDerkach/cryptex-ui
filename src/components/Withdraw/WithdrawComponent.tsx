import {useEffect, useState} from 'react';
import {
    Box,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
} from '@mui/material';
import {Row} from "../Flex.tsx";
import {type IWalletResponse} from '../../types';
import {WithdrawToBankAccount} from "./WithdrawToBankAccount.tsx";
import {WithdrawOnChain} from "./WithdrawOnChain.tsx";
import {Crypto} from "../../data/constants.ts";

interface WithdrawComponentProps {
    userData: IWalletResponse | null;
    isLoading: boolean;
    error: string | null;
    onWithdrawSuccess: () => void;
}

//@ts-expect-error enum
enum WithdrawTypes {
    OnChain = "On-Chain",
    BankAccount = "BankAccount",
}

export function WithdrawComponent({ userData, isLoading, onWithdrawSuccess }: WithdrawComponentProps) {
    const [withdrawType, setWithdrawType] = useState<WithdrawTypes | null>(null);
    const [availableBalance, setAvailableBalance] = useState<number | null>(null);

    const title = withdrawType === WithdrawTypes.OnChain ? 'Withdraw to External Address' : 'Withdraw to Card';

    const onWithdrawTypeChange = (event: any) => {
        setWithdrawType(event.target.value as WithdrawTypes);
        setAvailableBalance(userData?.balance || 0)
    }

    useEffect(() => {
        if (withdrawType === WithdrawTypes.OnChain) {
            const coin = userData?.wallet.amountOfCoins.find(x => x.name == Crypto.BTC);
            setAvailableBalance(coin?.amount || 0);
            return;
        }

        if (withdrawType === WithdrawTypes.BankAccount) {
            setAvailableBalance(userData?.balance || 0);
            return;
        }

    }, [userData, withdrawType]);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Paper elevation={4} sx={{ borderRadius: 3, p: 4, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {withdrawType === null ? "Select Withdraw Type" : title}
            </Typography>
            {availableBalance !== null && (
                <Typography variant="body1" gutterBottom sx={{ mb: 3, color: 'text.secondary' }}>
                    Available Balance: <b style={{ color: '#4caf50' }}>{availableBalance?.toFixed(2)}</b>
                </Typography>
            )}

            <Row sx={{ paddingBottom: '20px' }}>
                <FormControl fullWidth={true}>
                    <InputLabel>Withdraw type</InputLabel>
                    <Select
                        value={withdrawType}
                        label="Withdraw type"
                        onChange={onWithdrawTypeChange}
                    >
                        <MenuItem value={WithdrawTypes.OnChain}>On-Chain</MenuItem>
                        <MenuItem value={WithdrawTypes.BankAccount}>Bank Account</MenuItem>
                    </Select>
                </FormControl>
            </Row>

            <Grid container spacing={3}>
                {withdrawType === WithdrawTypes.BankAccount && (
                    <WithdrawToBankAccount
                        userData={userData}
                        onWithdrawSuccess={onWithdrawSuccess}
                    />
                )}

                {withdrawType === WithdrawTypes.OnChain && (
                    <WithdrawOnChain
                        userData={userData}
                        onWithdrawSuccess={onWithdrawSuccess}
                        availableBalance={availableBalance}
                        setAvailableBalance={setAvailableBalance}
                    />
                )}
            </Grid>
        </Paper>
    );
}