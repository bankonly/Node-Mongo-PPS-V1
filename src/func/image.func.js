const sharp = require('sharp');

const ImageFunc = {
    aws_resize: async ({ file, resize = [800, 256] }) => {
        let result = []
        for (let i = 0; i < resize.length; i++) {
            const element = resize[i];
            const image_resized = await sharp(file.data)
                .resize(element, element, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true,
                })
                .toBuffer()
            result.push(image_resized)
        }
        return result
    }
}

module.exports = ImageFunc