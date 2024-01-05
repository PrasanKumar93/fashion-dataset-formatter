const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const zlib = require('zlib');


function generateNewJSONFiles(folderPath, outputFolderPath) {
    if (folderPath && outputFolderPath) {
        fs.readdirSync(folderPath).forEach((file) => {
            if (path.extname(file) === '.json') {
                const filePath = path.join(folderPath, file);
                const fileData = fs.readFileSync(filePath, 'utf8');
                let jsonData = JSON.parse(fileData);

                if (jsonData?.data) {
                    jsonData = jsonData.data;

                    // consider only required fields
                    const outputData = {
                        productId: jsonData.id?.toString(),
                        styleImages_default_imageURL: jsonData?.styleImages?.default?.imageURL,
                        price: Number(jsonData.price),
                        productDisplayName: jsonData.productDisplayName,
                        variantName: jsonData.variantName,
                        brandName: jsonData.brandName,
                        ageGroup: jsonData.ageGroup,
                        gender: jsonData.gender,
                        displayCategories: jsonData.displayCategories,
                        masterCategory_typeName: jsonData.masterCategory?.typeName,
                        subCategory_typeName: jsonData.subCategory?.typeName,
                        productDescriptors_description_value:
                            jsonData.productDescriptors?.description?.value,
                        productColors: jsonData.baseColour + ',' + jsonData.colour1,
                        season: jsonData.season,
                        usage: jsonData.usage,
                    };

                    // const outputFilePath = path.join(outputFolderPath, `${file}.json`);
                    // fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2));

                    // Using Gzip compression
                    const outputFilePath = path.join(outputFolderPath, `${file}.gz`);
                    const jsonString = JSON.stringify(outputData, null, 2);
                    const compressed = zlib.gzipSync(jsonString); // use zlib.gunzipSync() to decompress
                    fs.writeFileSync(outputFilePath, compressed);
                    console.log(`JSON file ${file} size is : ${compressed.length / 1000} kb`);
                }

            }
        });
    }
}

function generateNewCompressedImages(folderPath, outputFolderPath) {

    if (folderPath && outputFolderPath) {
        fs.readdirSync(folderPath).forEach((file) => {
            const filePath = path.join(folderPath, file);
            //const outputFilePath = path.join(outputFolderPath, file);
            const outputFilePath = path.join(outputFolderPath, file.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp'));

            if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
                sharp(filePath)
                    .resize({ fit: 'inside', withoutEnlargement: true })
                    .toFormat('webp', { quality: 80 }) //webp for smaller size
                    //.toFormat('jpeg', { quality: 80 })
                    .toBuffer()
                    .then((buffer) => {
                        fs.writeFileSync(outputFilePath, buffer);
                        console.log(`Image ${file} size is : ${buffer.length / 1000} kb`);
                    })
                    .catch((error) => {
                        console.error(`Error compressing image ${file}:`, error);
                    });
            }
        });
    }
}

function groupDataAndImages(folderPathJSON, folderPathImages, outputFolderPath) {

    /**
     * Example
     * STEP 1: copy 1163.json.gz to outputFolderPath/1163/product-data.json.gz
     * STEP 2: copy 1163.webp to outputFolderPath/1163/product-img.webp
     * STEP 3: group 1000 products in one folder
     */
    if (folderPathJSON && folderPathImages && outputFolderPath) {

        //--STEP 1-------------------------
        fs.readdirSync(folderPathJSON).forEach((file) => {
            if (path.extname(file) === '.gz') {
                const productId = path.basename(file, '.json.gz');
                const productFolderPath = path.join(outputFolderPath, productId);

                if (!fs.existsSync(productFolderPath)) {
                    fs.mkdirSync(productFolderPath);
                }

                const jsonFilePath = path.join(folderPathJSON, file);
                const jsonFileDestPath = path.join(productFolderPath, 'product-data.json.gz');
                fs.copyFileSync(jsonFilePath, jsonFileDestPath);
                console.log(`JSON file ${file} copied to ${jsonFileDestPath}`);
            }
        });

        //--STEP 2-------------------------
        fs.readdirSync(folderPathImages).forEach((file) => {
            if (path.extname(file) === '.webp') {
                const productId = path.basename(file, '.webp');
                const productFolderPath = path.join(outputFolderPath, productId);

                if (!fs.existsSync(productFolderPath)) {
                    fs.mkdirSync(productFolderPath);
                }

                const imageFilePath = path.join(folderPathImages, file);
                const imageFileDestPath = path.join(productFolderPath, 'product-img.webp');
                fs.copyFileSync(imageFilePath, imageFileDestPath);
                console.log(`Image file ${file} copied to ${imageFileDestPath}`);
            }
        });

        //--STEP 3-------------------------

        const products = fs.readdirSync(outputFolderPath);
        const numberOfProducts = products.length;
        const numberOfProductsInFolder = 1000;
        const numberOfFolders = Math.ceil(numberOfProducts / numberOfProductsInFolder);

        let productIndex = 0;
        for (let i = 0; i < numberOfFolders; i++) {
            const folderName = `${i + 1}`.padStart(2, '0');
            const folderPath = path.join(outputFolderPath, folderName);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            for (let j = 0; j < numberOfProductsInFolder; j++) {
                console.log(`Folder: ${folderName}`);
                if (productIndex < numberOfProducts) {
                    const product = products[productIndex];
                    const productPath = path.join(outputFolderPath, product);
                    const productDestPath = path.join(folderPath, product);
                    fs.renameSync(productPath, productDestPath);
                    productIndex++;
                }
                else {
                    break;
                }
            }
        }
    }

}


const folderPathJSON = './data/product-data';
const outputFolderPathJSON = './data/converted/product-data';
generateNewJSONFiles(folderPathJSON, outputFolderPathJSON);

const folderPathImages = './data/product-images';
const outputFolderPathImages = './data/converted/product-images';
generateNewCompressedImages(folderPathImages, outputFolderPathImages);

const outputFolderPathProducts = './products';
groupDataAndImages(outputFolderPathJSON, outputFolderPathImages, outputFolderPathProducts);
