import { hash, verify } from "argon2";
const jwt = require('jsonwebtoken');
import { DatabaseService } from "../database-prisma/database.service"; 
import { User } from "@prisma/client";

const ACCESS_KEY = process.env.ACCESS_KEY!;
const REFRESH_KEY = process.env.REFRESH_KEY!;

const database = new DatabaseService(); 

export const registerLocal = async (user: Pick<User, "email" | "password">) => {
  user.password = await hash(user.password);

  const existing = await database.user.findUnique({
    where: { email: user.email },
  });
  if (existing) throw new Error("Your email is already registered");

  // Create user and get the full object including the default role
  const newUser = await database.user.create({ data: user });
  
  // Pass both id and role to generate tokens
  const tokens = await generateTokens({ id: newUser.id, role: newUser.role });

  await storeRefreshToken(newUser.id, tokens.refreshToken);
  return tokens;
};

export const loginLocal = async (user: Pick<User, "email" | "password">) => {
  const foundUser = await database.user.findUnique({
    where: { email: user.email },
  });
  if (!foundUser) throw new Error("User is not registered");

  const isValid = await verify(foundUser.password, user.password);
  if (!isValid) throw new Error("Incorrect password");

  // Pass both id and role to generate tokens
  const tokens = await generateTokens({ id: foundUser.id, role: foundUser.role });
  
  await storeRefreshToken(foundUser.id, tokens.refreshToken);

  return {
    id: foundUser.id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    role: foundUser.role,
  };
};

export const logout = async (user: { id: string }) => {
  const found = await database.user.findUnique({ where: { id: user.id } });
  if (!found) throw new Error("User is not registered");
  if (!found.refreshToken) throw new Error("Already logged out");

  await database.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });
};

export const refreshToken = async (user: {
  id: string;
  refreshToken: string;
}) => {
  const found = await database.user.findUnique({ where: { id: user.id } });
  if (!found || !found.refreshToken) throw new Error("Invalid refresh token");

  const isValid = await verify(found.refreshToken, user.refreshToken);
  if (!isValid) throw new Error("Invalid refresh token");

  // Pass both id and role to generate tokens
  const tokens = await generateTokens({ id: found.id, role: found.role });
  await storeRefreshToken(found.id, tokens.refreshToken);

  return tokens;
};

const storeRefreshToken = async (id: string, refreshToken: string) => {
  const hashed = await hash(refreshToken);
  await database.user.update({ where: { id }, data: { refreshToken: hashed } });
};

// Payload now explicitly requires id and role
const generateTokens = async (payload: { id: string, role: string }) => {
  const accessToken = jwt.sign(payload, ACCESS_KEY, { expiresIn: "7d" });
  const refreshToken = jwt.sign(payload, REFRESH_KEY, { expiresIn: "70d" });
  return { accessToken, refreshToken };
};