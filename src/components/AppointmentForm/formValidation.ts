import { z } from "zod";
import { setHours, setMinutes, startOfToday } from "date-fns";

export const appointmentFormSchema = z
  .object({
    petName: z.string().trim().min(3, { message: "Nome do pet é obrigatório" }),
    tutorName: z
      .string()
      .trim()
      .min(3, { message: "Nome do tutor é obrigatório" }),
    phone: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
    description: z
      .string()
      .trim()
      .min(1, { message: "Descrição é obrigatória" }),
    scheduleAt: z
      .date({ message: "A data é obrigatória" })
      .min(startOfToday(), { message: "A data deve ser no passado" }),
    time: z.string().min(1, { message: "O horário é obrigatório" }),
  })
  .refine(
    (data) => {
      const [hour, minute] = data.time.split(":");
      const scheduleDateTime = setMinutes(
        setHours(data.scheduleAt, Number(hour)),
        Number(minute)
      );
      return scheduleDateTime > new Date();
    },
    {
      path: ["time"],
      message: "O horário deve ser não pode ser no passado",
    }
  );

export type AppointmentFormSchema = z.infer<typeof appointmentFormSchema>;
