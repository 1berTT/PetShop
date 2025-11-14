"use client";

import { Appointment } from "@/types/appointment";
import { cn } from "@/lib/utils";
import { AppointmentForm } from "../AppointmentForm";
import { Button } from "../ui/button";
import { Pen, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { deleteAppointment } from "@/app/action";
import { toast } from "sonner";
import { useState } from "react";

type AppointmentCardProps = {
  appointment: Appointment;
  isFirstInSection?: boolean;
};

export function AppointmentCard({
  appointment,
  isFirstInSection = false,
}: AppointmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  async function handleDeleteAppointment() {
    try {
      setIsDeleting(true);
      const result = await deleteAppointment(appointment.id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Agendamento deletado com sucesso");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao deletar agendamento");
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-[15%_35%_30%_20%] items-center py-3",
        !isFirstInSection && "border-t border-[#353339]"
      )}
    >
      <div className="text-left pr-4 md:pr-0 ">
        <span className="text-label-small text-content-primary font-semibold ">
          {appointment.time}
        </span>
      </div>
      <div className="text-right md:text-left md:pr-4">
        <div className="flex items-center justify-end md:justify-start gap-1">
          <span className="text-label-small text-content-primary font-semibold">
            {appointment.petName}
          </span>
          <span className="text-label-small text-content-secondary">/</span>
          <span className="text-label-small text-content-secondary">
            {appointment.tutorName}
          </span>
        </div>
      </div>
      <div className="text-left pr-4 hidden md:block mt-1 md:mt-0 col-span-2 md:col-span-1 xl:col-span-1 xl:block xl:mt-0">
        <span className="text-paragraph-small-size text-content-secondary">
          {appointment.description}
        </span>
      </div>
      <div className="text-right mt-2 md:mt-0 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
        <AppointmentForm appointment={appointment}>
          <Button variant="edit" size="icon">
            <Pen size={16} />
          </Button>
        </AppointmentForm>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="remove" size="icon">
              <Trash2 size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover agendamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover esse agendamento ? Esta ação não
                pode ser desfeita
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAppointment}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Removendo...</span>
                  </>
                ) : (
                  <span>Remover agendamento</span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
