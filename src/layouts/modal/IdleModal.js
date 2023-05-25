// import React from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export const IdleTimeOutModal = ({ showModal, handleClose, handleLogout, remainingTime }) =>
// {

//     return (
//         <Modal show={showModal} onHide={handleClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>You Have Been Idle!</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>You Will Get Timed Out. You want to stay?</Modal.Body>
//             <Modal.Footer>
//                 <Button variant="danger" onClick={handleLogout}>
//                     Logout
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };
{
    const [open, setOpen] = React.useState(false);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };

    return (
        <div>
            <Dialog
                open={showModal}
                onClose={handleClose}
                onBackdropClick="false"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Session Expired"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your session has expired. Please try again later
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogout} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};