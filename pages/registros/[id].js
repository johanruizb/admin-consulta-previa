import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";

import { useRouter } from "next/navigation";

import * as React from "react";

export default function BasicModalDialog({ props }) {
    const router = useRouter();

    const onClose = () => {
        router.back();
    };

    console.log(props);

    return (
        <React.Fragment>
            <Modal open onClose={onClose}>
                <ModalDialog>
                    <DialogTitle>Create new project</DialogTitle>
                    <DialogContent>
                        Fill in the information of the project.
                    </DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input autoFocus required />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Input required />
                            </FormControl>
                            <Button type="submit">Submit</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
