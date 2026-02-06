import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";

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
  /*   const patient = await prisma.$transaction(async(tx)=>{
         await tx.patient.
    }) */

  return data;
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
