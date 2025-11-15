"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "@/utils/appointments-utils";

const appointmentSchema = z.object({
  petName: z.string().min(1),
  tutorName: z.string().min(1),
  phone: z.string().min(1),
  description: z.string().min(1),
  scheduleAt: z.date(),
});

function calculatePeriod(hour: number) {
  const isMorning = hour >= 9 && hour < 12;
  const isAfternoon = hour >= 13 && hour < 18;
  const isEvening = hour >= 19 && hour < 22;

  return {
    isMorning,
    isAfternoon,
    isEvening,
  };
}

type AppointmentData = z.infer<typeof appointmentSchema>;

export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduleAt } = parsedData;

    const hour = parseInt(formatDateTime(scheduleAt));

    const { isMorning, isAfternoon, isEvening } = calculatePeriod(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error: "Horário inválido",
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt: scheduleAt,
      },
    });

    if (existingAppointment) {
      return {
        error: "Horário já agendado",
      };
    }

    await prisma.appointment.create({
      data: { ...parsedData },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
    return {
      error: "Erro ao criar agendamento",
    };
  }
}

export async function updateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduleAt } = parsedData;

    const hour = parseInt(formatDateTime(scheduleAt));

    const { isMorning, isAfternoon, isEvening } = calculatePeriod(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error: "Horário inválido",
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt: scheduleAt,
        id: {
          not: id,
        },
      },
    });

    if (existingAppointment) {
      return {
        error: "Horário já agendado",
      };
    }

    await prisma.appointment.update({
      where: {
        id: id,
      },
      data: { ...parsedData },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
    return {
      error: "Erro ao editar agendamento",
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: {
          not: id,
        },
      },
    });

    if (!existingAppointment) {
      return {
        error: "Agendamento não encontrado",
      };
    }

    await prisma.appointment.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
    return {
      error: "Erro ao deletar agendamento",
    };
  }
}
