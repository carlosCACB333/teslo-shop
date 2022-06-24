import { Grid, TextField, Typography, Button, Link, Divider, IconButton } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import React, { useContext } from "react";
import { AuthLayout } from "../../components/layout";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Logo, Toast } from "../../components/UI";
import { useForm } from "react-hook-form";
import { loginResolver } from "../../validators";
import { AuthContext } from "../../context";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getSession, signIn, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";

interface IForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const next = (router.query.next as string) || "/";

  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({ mode: "onChange", resolver: loginResolver });

  const onLogin = async (data: IForm) => {
    signIn("credentials", { ...data, redirect: false })
      .then((res: any) => {
        if (res.ok) {
          toast.success("Has iniciado sesión");
          router.push(next);
        } else {
          toast.error(res.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthLayout title="Login" desc="Iniciar sesion para comprar">
      <Toast />
      <form onSubmit={handleSubmit(onLogin)} noValidate>
        <Grid container height="100vh" alignItems="center" justifyItems="center">
          <Grid item sm={6} display={{ xs: "none", sm: "block" }}>
            <Image layout="responsive" src="/login.png" height="50%" width="80%" alt="Logo" priority />
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={4} border="1px solid" padding={6} borderRadius={2}>
            <Grid item xs={12} display="flex" justifyContent="center" marginY={4}>
              <Logo />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h1">Iniciar sesión</Typography>
                <Typography>Cominza hacer tus compras de manera online</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth type="submit">
                  Entrar
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" textAlign="center">
                  ¿Nuevo en nuestra plataforma?
                  <NextLink href={`/auth/signup?next=${next}`}>
                    <Link> Crear cuenta</Link>
                  </NextLink>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} textAlign="center">
                <IconButton onClick={() => signIn("github")}>
                  <GitHubIcon />
                </IconButton>
                <IconButton>
                  <FacebookIcon />
                </IconButton>
                <IconButton>
                  <GoogleIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { next = "/" } = query as { next: string };

  if (session) {
    return { redirect: { destination: next, permanent: false } };
  }

  return { props: {} };
};
