import { jwtVerify, SignJWT } from "jose";

console.log(Bun.env.JWT_SECRET);

// precisa de secret como Uint8Array
const secret = new TextEncoder().encode(
  Bun.env.JWT_SECRET || "uma-chave-secreta-deve-ser-longaaa",
);

// gerar token
export async function signToken(payload: object) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

// verificar token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getToken(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return null;
  }
  const token = auth.split(" ")[1];
  if (!token) {
    return null;
  }
  return await verifyToken(token);
}

export async function protectRoute(req: Request) {
  const payload = await getToken(req);
  if (!payload) {
    return new Response("Unauthorized", { status: 401 });
  }
}
