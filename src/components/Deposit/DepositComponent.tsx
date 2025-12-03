// src/components/Deposit/DepositComponent.tsx
import {
    Typography,
    Paper,
    Box, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {DepositFiat} from "./DepositFiat.tsx";
import {useState} from "react";
import {Row} from "../Flex.tsx";
import DepositCrypto from "./DepositCrypto.tsx";
import type {IWalletResponse} from "../../types.ts";

//@ts-expect-error enum
enum DepositTypes {
    Fiat = "Fiat",
    Crypto = "Crypto",
}

interface DepositComponentProps {
    userData: IWalletResponse | null;
    onDepositSuccess: () => void;
}

export function DepositComponent({ onDepositSuccess, userData }: DepositComponentProps) {
    const [depositType, setDepositType] = useState<DepositTypes | null>(null);

    return (
        <Paper elevation={4} sx={{ borderRadius: 3, p: 4, maxWidth: 600, margin: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold">
                    Deposit Funds
                </Typography>
            </Box>

            <Row sx={{ paddingBottom: '20px' }}>
                <FormControl fullWidth={true}>
                    <InputLabel>Deposit type</InputLabel>
                    <Select
                        value={depositType}
                        label="Deposit Type"
                        onChange={(e) => setDepositType(e.target.value as DepositTypes)}
                    >
                        <MenuItem value={DepositTypes.Fiat}>Fiat</MenuItem>
                        <MenuItem value={DepositTypes.Crypto}>Crypto</MenuItem>
                    </Select>
                </FormControl>
            </Row>

            {depositType === DepositTypes.Fiat && (
                <DepositFiat onDepositSuccess={onDepositSuccess} />
            )}

            {depositType === DepositTypes.Crypto && (
                <DepositCrypto userData={userData} />
            )}
        </Paper>
    );
}