# Fashion dataset formatter

## Overview

This tool aims to optimize the storage of a large fashion dataset, focusing on reducing the disk space required without compromising much on the quality of data.

## Key Features

- **Image Optimization**: Converts and resizes images to .webp format. Reduced dataset size from 15 GB to 4.12 GB for over 44,000 products.
- **JSON Compression**: Streamlines JSON files by keeping only essential fields and applies gzip compression, reducing size from 870 MB to 180 MB.
- **Organized File Structure**: Each product's image and JSON are stored in a dedicated folder named after the productId.
- **Dataset Segmentation**: Organizes products into subfolders, each containing up to 1000 products, for manageable dataset chunks (e.g., folders named 01, 02, 03, etc.).

## Testing the Application

The original dataset is available at [Fashion Product Images Dataset](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset).

### Setup Instructions

1. Download the dataset from the above link.
1. Transfer the required JSON files from `fashion-dataset/styles` to `data/product-data/`.
1. Move the desired images from `fashion-dataset/images` to `data/product-images/`.

### Starting the Application

Run the following command to start the application:

```sh
npm start

```

## Output

The final output is stored in the `products` folder.

### Output folder structure

products/

- 01/
  - products-list.txt
  - productId1/
    - product-data.json.gz
    - product-img.webp
  - ...
  - productId1000/
    - product-data.json.gz
    - product-img.webp
- 02/
  - products-list.txt
- 03/
  - products-list.txt
- ...

Note :

1. `products-list.txt` in each folder contains a list of all products in that folder, with a maximum of 1000 products per folder.
2. Currently, the project includes only 10,000 out of the 44,000+ products. Follow the provided instructions to process the entire dataset.
