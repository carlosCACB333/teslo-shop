import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import React, { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layout/ShopLayout";
import { IAddress } from "../../interfaces";
import { countries } from "../../utils/countries";
import { addressResolver } from "../../validators";

import { CartContext } from "../../context";

const defaultValues: IAddress = JSON.parse(Cookies.get("address") || "{}");

export const AddressPage = () => {
  const { setAddress } = useContext(CartContext);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<IAddress>({ resolver: addressResolver, mode: "onChange", defaultValues });

  const selecDef = useRef("");

  useEffect(() => {
    selecDef.current = defaultValues.country || "PER";
    reset(defaultValues);
  }, [reset]);

  const router = useRouter();

  const onSubmit = (data: IAddress) => {
    Cookies.set("address", JSON.stringify(data));
    setAddress(data);
    router.push("/checkout/summary");
  };

  return (
    <ShopLayout title="Direccion" desc="Direreccion de envio">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container maxWidth="lg">
          <Typography variant="h1">Direccion</Typography>
          <Typography>Direccion de envío del pedido</Typography>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                {...register("address")}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección 2 (opcional)"
                {...register("address2")}
                error={!!errors.address2}
                helperText={errors.address2?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Código postal" {...register("zip")} error={!!errors.zip} helperText={errors.zip?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Ciudad" {...register("city")} error={!!errors.city} helperText={errors.city?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Teléfono" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              {!!selecDef.current && (
                <TextField
                  select
                  fullWidth
                  label="Pais"
                  error={!!errors.country}
                  helperText={errors.firstName?.message}
                  {...register("country")}
                  defaultValue={selecDef.current}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>
            <Grid item xs={12} marginTop={2}>
              <Button size="large" fullWidth type="submit">
                Revisar pedido
              </Button>
            </Grid>
          </Grid>
        </Container>
      </form>
    </ShopLayout>
  );
};

export default AddressPage;
