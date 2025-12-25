import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Async signToken
export const signToken = (
  payload: object,
  expiresIn: jwt.SignOptions["expiresIn"] = "1d",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, token) => {
      if (err || !token) {
        reject(err || new Error("Token generation failed"));
      } else {
        resolve(token);
      }
    });
  });
};

// Async verifyToken
export const verifyToken = <T = any>(token: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as T);
      }
    });
  });
};
