"use client"

import { Button } from "./ui/button";
import { LendModal } from "./modals/lend-modal-book-search";
import React from "react";

const QuickActions = () => {
    const [openLendModal, setOpenLendModal] = React.useState(false)

    return (
        <>
            <LendModal
                isOpen={openLendModal}
                onClose={() => setOpenLendModal(false)}
            />
            <Button
                variant="outline"
                onClick={() => setOpenLendModal(true)}
            >
                Prestar
            </Button>
            <Button
                variant="outline"
            >
                Devolver
            </Button>
        </>
    );
}

export default QuickActions;