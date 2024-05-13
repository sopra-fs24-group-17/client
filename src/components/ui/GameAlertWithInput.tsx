import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface GameAlertWithInputProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    description: string;
    playerNames: string[];
    onSubmit: (value: string) => void;
}

export default function GameAlertWithInput({ open, handleClose, title, description, playerNames, onSubmit }: GameAlertWithInputProps) {
    const [selectedPlayer, setSelectedPlayer] = React.useState('');

    const names = playerNames.filter(name => name !== localStorage.getItem('username'));

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedPlayer(event.target.value as string);
    };

    const handleSubmit = () => {
        if (selectedPlayer) {
            onSubmit(selectedPlayer);
            setSelectedPlayer('');
            handleClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
                <Select
                    value={selectedPlayer}
                    onChange={handleChange}
                >
                    {names.map((name, index) => (
                        <MenuItem value={name} key={index}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} autoFocus disabled={!selectedPlayer}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
