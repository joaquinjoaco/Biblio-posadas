"use client"

import { Button } from "./ui/button";
import { BookSearchModal } from "./modals/lend-modal-book-search";
import React from "react";

const QuickActions = () => {
    const [openLendModal, setOpenLendModal] = React.useState(false)
    const [openReturnModal, setOpenReturnModal] = React.useState(false)

    return (
        <>
            {/* Quick lend modal */}
            <BookSearchModal
                actionType="lend"
                isOpen={openLendModal}
                onClose={() => setOpenLendModal(false)}
            />
            {/* Quick return Modal */}
            <BookSearchModal
                actionType="return"
                isOpen={openReturnModal}
                onClose={() => setOpenReturnModal(false)}
            />
            {/* Buttons */}
            <Button
                variant="outline"
                onClick={() => setOpenLendModal(true)}
            >
                Prestar
            </Button>
            <Button
                variant="outline"
                onClick={() => setOpenReturnModal(true)}
            >
                Devolver
            </Button>
        </>
    );
}

export default QuickActions;