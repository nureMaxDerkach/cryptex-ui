import {TextField, Typography} from "@mui/material";
import {Column, Row} from "../components/Flex.tsx";

export function LoginPage() {
    return (
        <Column style={{alignItems: "center", justifyContent: "center", height: "100%", width: "100%", gap: '16px'}}>
            <Column>
                <Typography variant="h4">
                    Log in
                </Typography>
            </Column>
            <Column style={{gap: '16px'}}>
                <Row gap='16px' style={{alignItems: 'center'}}>
                    <Column>
                        <Typography>Nickname:</Typography>
                    </Column>
                    <Column>
                        <TextField label="Outlined"/>
                    </Column>
                </Row>
                <Row gap='16px' style={{alignItems: 'center'}}>
                    <Column>
                        <Typography>Email:</Typography>
                    </Column>
                    <Column>
                        <TextField label="Outlined"/>
                    </Column>
                </Row>
                <Row gap='16px' style={{alignItems: 'center'}}>
                    <Column>
                        <Typography>Password:</Typography>
                    </Column>
                    <Column>
                        <TextField label="Outlined"/>
                    </Column>
                </Row>
            </Column>
        </Column>
    )
}