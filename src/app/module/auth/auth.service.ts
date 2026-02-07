import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface IUserLoginPayload {
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new Error("Failed to register patient!");
  }

  //   TODO: Create patient profile after signUp of patient in user model
  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });

      return patientTx;
    });

    return {
      ...data,
      patient,
    };
  } catch (error) {
    console.log("Transaction Error: ", error);

    // Delete the user if patient profile creation transaction fails
    await prisma.user.delete({
      where: { id: data.user.id },
    });

    throw error;
  }
};

const loginUser = async (payload: IUserLoginPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("The user is blocked!");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new Error("The user is deleted!");
  }

  return data;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
