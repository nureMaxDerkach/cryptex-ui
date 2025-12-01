import {Grid, IconButton, InputAdornment, MenuItem, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import type {IWalletResponse} from "../../types.ts";
import {Crypto} from "../../data/constants.ts";
import {Column} from "../Flex.tsx";
import {ContentCopy} from "@mui/icons-material";

interface Props {
    userData: IWalletResponse | null;
}

function DepositCrypto({userData}: Props) {
    const [crypto, setCrypto] = useState<Crypto>(Crypto.BTC);
    const [depositAddress, setDepositAddress] = useState<string>();

    useEffect(() => {
        if (!userData) {
            return;
        }

        setDepositAddress(getDepositAddressByCrypto(crypto));
    }, []);

    const onCryptoChange = (event: any) => {
        const value = event.target.value as Crypto;

        setCrypto(value)
        setDepositAddress(getDepositAddressByCrypto(value));
    }

    const getDepositAddressByCrypto = (crypto: Crypto) => {
        return userData?.wallet.amountOfCoins.find(x => x.name === crypto)?.depositAddress;
    }

    return (
        <Column gap='20px'>
            <Grid>
                <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                    Select crypto to add funds to your wallet.
                </Typography>

                <TextField
                    select
                    fullWidth
                    label="Crypto"
                    value={crypto}
                    onChange={onCryptoChange}
                >
                    <MenuItem value={Crypto.BTC}>BTC</MenuItem>
                    <MenuItem value={Crypto.ETH}>ETH</MenuItem>
                    <MenuItem value={Crypto.LTC}>LTC</MenuItem>
                    <MenuItem value={Crypto.BNB}>BNB</MenuItem>
                    <MenuItem value={Crypto.SOLANA}>Solana</MenuItem>
                    <MenuItem value={Crypto.RIPPLE}>Ripple</MenuItem>
                </TextField>
            </Grid>


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
                                    onClick={() => navigator.clipboard.writeText(depositAddress!)}
                                    edge="end"
                                >
                                    <ContentCopy />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </Column>
    )
}

export default DepositCrypto