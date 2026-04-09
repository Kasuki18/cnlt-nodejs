const { Transform } = require('stream');

class TextTransform extends Transform {
    _transform(chunk, encoding, callback) {
        // Chuyển nội dung sang chữ hoa
        const upperCaseContent = chunk.toString().toUpperCase();
        this.push(upperCaseContent);
        callback();
    }
}

module.exports = TextTransform;