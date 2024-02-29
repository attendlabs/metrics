"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { CancelingModal } from "../_components/CancelingModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
    disabled?: boolean;
    companyId: string;
    isActive: boolean | null;
};

export const Actions = ({
    disabled,
    companyId,
    isActive
}: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isActive) {
                await axios.patch(`/api/companies/${companyId}/inactivate`);
                toast.success("Empresa inativada");
            } else {
                await axios.patch(`/api/companies/${companyId}/activate`);
                toast.success("Empresa ativada.");
            }
            router.refresh();
        } catch (error) {
            toast.error("Aconteceu algo errado.");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/companies/${companyId}`);

            toast.success("Empresa excluída de sua base de dados.");
            router.refresh();
            router.push(`/admin/companies`);
        } catch (error) {
            toast.error("Aconteceu algo errado");
        } finally {
            setIsLoading(false);
        }
    }

    const onCancelSubscription = async (params) => {
        console.log(params, "CANCELSUBSCRIPTION");
    }


    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isActive ? "Inativar" : "Ativar"}
            </Button>
            <CancelingModal onConfirm={onCancelSubscription} >
                <Button size="sm" variant="destructive">
                    Cancelar assinatura
                </Button>
            </CancelingModal>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}