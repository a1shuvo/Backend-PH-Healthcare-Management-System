import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPlayload } from "./admin.interface";

const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    // where: { isDeleted: false },
    include: { user: true },
  });

  return admins;
};

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
    include: { user: true },
  });

  return admin;
};

const updateAdmin = async (id: string, playload: IUpdateAdminPlayload) => {
  // TODO: Validate who is updating admin user.
  // Only super_admin can update super_admin and admin user
  // admin can not update super_admin user

  const isAdminExist = await prisma.admin.findUnique({
    where: { id },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found!");
  }

  const { admin } = playload;

  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data: { ...admin },
  });

  return updatedAdmin;
};

// Soft Delete: admin user by setting isDeleted to true and also delete the user session and account
const deleteAdmin = async (id: string, user: IRequestUser) => {
  // TODO: Validate who is deleting admin user.
  // Only super_admin can delete super_admin and admin user
  // admin can not delete super_admin user

  const isAdminExist = await prisma.admin.findUnique({
    where: { id },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin or Super Admin not found!");
  }

  // Prevent self delete
  if (isAdminExist.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You can not delete yourself!");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED, // optional: if want to also block the user
      },
    });

    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    await tx.account.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    const admin = await getAdminById(id);
    return admin;
  });

  return result;
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
