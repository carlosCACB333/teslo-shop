import { Grid, TextField, Typography, Button, Link, Divider, IconButton } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import React, { useContext } from "react";
import { AuthLayout } from "../../components/layout";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Logo, Toast } from "../../components/UI";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";
import { messages } from "validators";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IForm {
  name: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const { signupUser } = useContext(AuthContext);
  const router = useRouter();
  const next = (router.query.next as string) || "/";

  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm<IForm>({ mode: "onChange", resolver: signupResolver });

  const onSignup = async (data: IForm) => {
    const err = await signupUser(data.name, data.email, data.password);
    if (err) {
      const errors = Object.entries(err.errors || {});
      errors.forEach((e) => setError(e[0] as any, { message: e[1] }));
    } else {
      signIn("credentials", { email: data.email, password: data.password });
      toast("Se registró correctamente");
    }
  };
  return (
    <AuthLayout title="Signup" desc="Crear cuenta">
      <Toast />
      <form noValidate onSubmit={handleSubmit(onSignup)}>
        <Grid container height="100vh" alignItems="center" justifyItems="center">
          <Grid item sm={6} display={{ xs: "none", sm: "block" }}>
            <Image layout="responsive" src="/login.png" height="50%" width="80%" alt="Logo" />
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={4} border="1px solid" padding={6} borderRadius={2}>
            <Grid item xs={12} display="flex" justifyContent="center" marginY={4}>
              <Logo />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h1">Crear cuenta</Typography>
                <Typography>Cominza hacer tus compras de manera online</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Nombre" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
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
                  Crear
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" textAlign="center">
                  ¿ya tienes cuenta en nuestra plataforma?
                  <NextLink href={`/auth/login?next=${next}`}>
                    <Link> Iniciar sesión</Link>
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
                {/* <IconButton>
                  <FacebookIcon />
                </IconButton>
                <IconButton>
                  <GoogleIcon />
                </IconButton> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });
  const { next = "/" } = query as { next: string };

  if (session) {
    return { redirect: { destination: next, permanent: false } };
  }

  return { props: {} };
};

const signupResolver = yupResolver(
  yup.object({
    name: yup.string().required(messages.msgRequered),
    email: yup.string().required(messages.msgRequered).email(messages.msgEmail),
    password: yup.string().required(messages.msgRequered).min(6, messages.msgMinPass),
  })
);
