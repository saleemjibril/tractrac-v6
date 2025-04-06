// middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// export async function middleware(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;
//   const protectedPaths = ["/", "/admin"];
//   const isPathProtected = protectedPaths?.some((path) => pathname == path);
//   const res = NextResponse.next();
//   if (isPathProtected) {
//     if (!token) {
//       const url = new URL(`/login`, req.url);
//       url.searchParams.set("callbackUrl", pathname);
//       return NextResponse.redirect(url);
//     }
//   }
//   return res;
// }
