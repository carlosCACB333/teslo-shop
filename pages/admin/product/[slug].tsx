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
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { messages } from "validators";

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
  } = useForm<IProduct>({ defaultValues: product, resolver: createProductResolver });

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
        toast.success(`Se ${data._id ? "actualiz??" : "cre??"} correctamente`);
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
              label="T??tulo"
              fullWidth
              sx={{ mb: 1 }}
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Descripci??n"
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
              {...register("inStock")}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Precio"
              type="number"
              fullWidth
              sx={{ mb: 1 }}
              {...register("price")}
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
              <FormLabel>G??nero</FormLabel>
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
              <FormLabel sx={{ mb: 1 }}>Im??genes</FormLabel>
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

              <Chip label="Es necesario al 2 imagenes" color="error" variant="outlined" sx={{ marginBottom: 2 }} />

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
    temp.images = ["img1", "img2"];
    temp.type = "";
    temp.gender = "";
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

const createProductResolver = yupResolver(
  yup.object({
    title: yup.string().required(messages.msgRequered),
    inStock: yup.number().required(messages.msgRequered).positive(messages.msgPositive),
    images: yup.array().of(yup.string().required(messages.msgRequered)),
    price: yup.number().required(messages.msgRequered).positive(messages.msgPositive),
    description: yup.string().required(messages.msgRequered),
    sizes: yup.array().of(yup.string().required(messages.msgRequered).oneOf(allowedSizes, messages.msgNotAllowed)),
    tags: yup.array().of(yup.string().required(messages.msgRequered)),
    type: yup.string().required(messages.msgRequered).oneOf(allowedTypes, messages.msgNotAllowed),
    gender: yup.string().required(messages.msgRequered).oneOf(allowedGenres, messages.msgNotAllowed),
    slug: yup
      .string()
      .required(messages.msgRequered)
      .test("not-empty", messages.msgNoBlanks, (val) => !val!.includes(" ")),
  })
);
