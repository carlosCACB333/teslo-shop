import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  capitalize,
  Card,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { ax } from "api";
import { HomeLayout } from "components/layout";
import { Toast } from "components/UI";
import { allowedGenres, allowedSizes, allowedTypes, productdb } from "database";
import { IProduct, ISize } from "interfaces";
import { Product } from "models";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messages } from "validators";
import { z } from "zod";

const productSchema = z.object({
  title: z.string({ invalid_type_error: messages.invalidValue }).trim().min(1, messages.msgRequered),
  inStock: z.number({ invalid_type_error: messages.invalidValue }),
  images: z.array(z.string({ invalid_type_error: messages.invalidValue })).min(2, messages.msgMin),
  price: z.number({ invalid_type_error: messages.invalidValue }).nonnegative(messages.msgPositive),
  description: z.string({ invalid_type_error: messages.invalidValue }).trim().min(1, messages.msgRequered),
  sizes: z.array(z.enum(allowedSizes as any), { invalid_type_error: messages.msgNotAllowed }),
  tags: z.array(z.string({ invalid_type_error: messages.invalidValue })),
  type: z
    .string({ invalid_type_error: messages.invalidValue })
    .refine((val) => allowedTypes.includes(val as any), { message: messages.msgNotAllowed }),
  gender: z.enum(allowedGenres as any, { invalid_type_error: messages.msgNotAllowed }),
  slug: z
    .string({ invalid_type_error: messages.invalidValue })
    .trim()
    .min(1, messages.msgRequered)
    .refine((val) => !val!.includes(" "), { message: messages.msgNoBlanks }),
});

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const [tagValue, setTagValue] = useState("");
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    formState: { errors },
    register,
    getValues,
    setValue,
    watch,
  } = useForm<IProduct>({ mode: "onChange", defaultValues: product, resolver: zodResolver(productSchema) });

  useEffect(() => {
    const obs = watch((data, e) => {
      if (e.name === "title") {
        setValue("slug", data.title?.replaceAll(" ", "_").replaceAll("'", "").toLocaleLowerCase() || "", { shouldValidate: true });
      }
    });

    return () => obs.unsubscribe();
  }, [watch, setValue]);

  const onChangeSize = (size: ISize, checked: boolean) => {
    const current = getValues("sizes");
    setValue("sizes", checked ? [...current, size] : current.filter((s) => s !== size), { shouldValidate: true });
  };

  const onSetTag = () => {
    const current = getValues("tags");
    if (!current.includes(tagValue) && tagValue.trim().length !== 0) {
      setValue("tags", [...current, tagValue], { shouldValidate: true });
      setTagValue("");
    }
  };

  const onDeleteTag = (tag: string) => {
    const current = getValues("tags");
    setValue(
      "tags",
      current.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: IProduct) => {
    ax({
      url: "/admin/product",
      method: data._id ? "PUT" : "POST",
      data,
    })
      .then((res) => {
        toast.success(`Se ${data._id ? "actualizó" : "creó"} correctamente`);
        router.replace(`/admin/product/${data.slug}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Se produjo un error ");
      });
  };

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const formdata = new FormData();
      formdata.append("file", files.item(i)!);

      ax.post("/admin/upload", formdata)
        .then((res) => setValue("images", [...getValues("images"), res.data.url], { shouldValidate: true }))
        .catch((err) => console.log(err));
    }
  };

  const onDeleteImg = (img: string) => {
    const current = getValues("images");
    setValue(
      "images",
      current.filter((i) => i !== img),
      { shouldValidate: true }
    );
  };
  return (
    <HomeLayout title={"Producto"} subTitle={`Editando: ${product.title}`} Icon={<DriveFileRenameOutline />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Toast />
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button color="primary" startIcon={<SaveOutlined />} sx={{ width: "150px" }} type="submit">
            {product._id ? "Actualizar" : "Guardar"}
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título"
              fullWidth
              sx={{ mb: 1 }}
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Descripción"
              fullWidth
              rows={3}
              sx={{ mb: 1 }}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Inventario"
              type="number"
              fullWidth
              sx={{ mb: 1 }}
              value={getValues("inStock")}
              onChange={(e) => setValue("inStock", Number(e.target.value), { shouldValidate: true })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Precio"
              type="number"
              fullWidth
              sx={{ mb: 1 }}
              value={getValues("price")}
              onChange={(e) => setValue("price", Number(e.target.value), { shouldValidate: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl fullWidth sx={{ mb: 1 }} error={!!errors.type}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup row value={getValues("type")} onChange={(e) => setValue("type", e.target.value as any, { shouldValidate: true })}>
                {allowedTypes.map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio color="primary" />} label={capitalize(option)} />
                ))}
              </RadioGroup>
              <FormHelperText>{errors.type?.message}</FormHelperText>
            </FormControl>

            <FormControl error={!!errors.gender} fullWidth sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={getValues("gender")}
                onChange={(e) => setValue("gender", e.target.value as any, { shouldValidate: true })}
              >
                {allowedGenres.map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio color="primary" />} label={capitalize(option)} />
                ))}
              </RadioGroup>
              <FormHelperText>{errors.gender?.message}</FormHelperText>
            </FormControl>

            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {allowedSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={<Checkbox checked={getValues("sizes").includes(size)} onChange={(e) => onChangeSize(size, e.target.checked)} />}
                  label={size}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              fullWidth
              sx={{ mb: 1 }}
              {...register("slug")}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Etiquetas"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [Enter] o [Spacebar] para agregar"
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value.toLocaleLowerCase())}
              onKeyPress={(e) => {
                if (e.code === "Enter" || e.code === "Space") {
                  onSetTag();
                  e.preventDefault();
                }
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {getValues("tags").map((tag) => {
                return <Chip key={tag} label={tag} onDelete={() => onDeleteTag(tag)} color="primary" size="small" sx={{ ml: 1, mt: 1 }} />;
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button color="secondary" fullWidth startIcon={<UploadOutlined />} sx={{ mb: 3 }} onClick={() => fileRef.current?.click()}>
                Cargar imagen
              </Button>

              <input
                type="file"
                accept="image/png, image/gif, iamge/jpg"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={onFileSelected}
              />

              {!!errors.images && <Chip label={errors.images?.message} color="error" variant="outlined" sx={{ marginBottom: 2 }} />}

              <Grid container spacing={2}>
                {getValues("images").map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card sx={{ position: "relative" }}>
                      <CardMedia component="img" className="fadeIn" image={img} alt={img} />
                      <IconButton onClick={() => onDeleteImg(img)}>
                        <CloseIcon />
                      </IconButton>

                      {/* <CardActions></CardActions> */}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </HomeLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = "" } = query;

  let product: IProduct | null;

  if (slug === "new") {
    const temp = JSON.parse(JSON.stringify(new Product()));
    delete temp._id;
    temp.type = "";
    temp.gender = "";
    temp.price = 0;
    product = temp;
  } else {
    product = await productdb.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: "/admin/product",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
