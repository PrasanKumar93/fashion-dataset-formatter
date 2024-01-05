# Fashion dataset formatter

## Requirement

To reduce fashion dataset size on disk

- Reduce image size (convert image to .webp format and resize), **870 MB -> 180MB**
- Reduce json size (Consider required json fields only and gzip json file), **15 GB -> 4.12 GB**
- Move product image and json in single folder (folder name == productId)
- Group products in multiples of 1000 into new folders like 01,02,03...etc, to create smaller datasets

## Test application

Original dataset can be downloaded from [online fashion dataset](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset)

### After download

- Copy all or required json files from "fashion-dataset/styles" to "data/product-data/"

- Copy all or required images from "fashion-dataset/images" to "data/product-images/"

### Start app

```sh
npm start

```

## Output

Final output will be in `products` folder
