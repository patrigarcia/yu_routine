import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from '../../../../lib/mongodb';
import Alumno from '../../../../lib/models/Alumno';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        codigoAlumno: { label: "Código", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        await connectToDatabase();

        if (!credentials?.codigoAlumno || !credentials?.password) {
          return null;
        }

        const alumno = await Alumno.findOne({ 
          codigoAlumno: credentials.codigoAlumno 
        });

        if (!alumno) {
          return null;
        }

        // Aquí deberías implementar la verificación de contraseña
        // Por ahora, solo verificamos el código de alumno
        return {
          id: alumno._id,
          codigoAlumno: alumno.codigoAlumno,
          nombreAlumno: alumno.nombreAlumno
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.codigoAlumno = user.codigoAlumno;
        token.nombreAlumno = user.nombreAlumno;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.codigoAlumno = token.codigoAlumno;
      session.user.nombreAlumno = token.nombreAlumno;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
