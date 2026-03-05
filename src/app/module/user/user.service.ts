import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdminPayload, ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];

  // Validated specialities from create doctor payload
  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new AppError(
        status.NOT_FOUND,
        `Specialty with id ${specialtyId} not found!`,
      );
    }

    specialties.push(specialty);
  }

  // Check by email if user already exist
  const userExists = await prisma.user.findUnique({
    where: { email: payload.doctor.email },
  });

  if (userExists) {
    throw new AppError(status.CONFLICT, "User with the email already exists!");
  }

  // Create user using better-auth
  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create doctor profile
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      // Get doctorId and specialtyId from specialties array
      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });

      // Create doctorSpecialty
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });

      // Finally create doctor object with user and specialties information
      const doctor = await tx.doctor.findUnique({
        where: { id: doctorData.id },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transaction Error: ", error);
    // Delete the user if doctor profile creation transaction fails
    await prisma.user.delete({
      where: { id: userData.user.id },
    });
    throw error;
  }
};

const createAdmin = async (payload: ICreateAdminPayload) => {
  // TODO: Validate who is creating admin user.
  // Only super_admin can create super_admin and admin user
  // admin can not create super_admin user

  // Check by email if user already exist
  const userExists = await prisma.user.findUnique({
    where: { email: payload.admin.email },
  });

  if (userExists) {
    throw new AppError(status.CONFLICT, "User with the email already exists!");
  }

  const { admin, role, password } = payload;

  const userData = await auth.api.signUpEmail({
    body: {
      ...admin,
      password,
      role,
      needPasswordChange: true,
    },
  });

  try {
    const adminData = await prisma.admin.create({
      data: {
        userId: userData.user.id,
        ...admin,
      },
    });

    return adminData;
  } catch (error) {
    console.log("Error creating admin: ", error);
    await prisma.user.delete({
      where: { id: userData.user.id },
    });

    throw error;
  }
};

export const UserService = {
  createDoctor,
  createAdmin,
};
