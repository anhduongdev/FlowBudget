import { prisma } from "@/lib/prisma";

interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export function findUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password_hash: true },
  });
}

export function findUserById(id: bigint) {
  return prisma.users.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
}

export function findUserCredentialsById(id: bigint) {
  return prisma.users.findUnique({
    where: { id },
    select: { id: true, password_hash: true },
  });
}

export function createUser(input: CreateUserInput) {
  return prisma.users.create({
    data: {
      name: input.name,
      email: input.email,
      password_hash: input.passwordHash,
    },
    select: { id: true, name: true, email: true },
  });
}

export function updateUserName(id: bigint, name: string) {
  return prisma.users.update({
    where: { id },
    data: { name },
    select: { id: true, name: true, email: true },
  });
}

export function updateUserPassword(id: bigint, passwordHash: string) {
  return prisma.users.update({
    where: { id },
    data: { password_hash: passwordHash },
    select: { id: true },
  });
}
