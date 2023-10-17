"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface HistoryActionsProps {
    disabled?: boolean;
    companyId: string;
    historyId: string;
};

export const HistoryActions = ({
    disabled,
    companyId,
    historyId,
}: HistoryActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            toast.success("Alterações salvas")
            router.push(`/admin/companies/${companyId}`);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/companies/${companyId}/histories/${historyId}`);

            toast.success("Histórico apagado.");
            router.refresh();
            router.push(`/admin/companies/${companyId}`);
        } catch (error) {
            toast.error("Algo errado aconteceu");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                Salvar alterações
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}